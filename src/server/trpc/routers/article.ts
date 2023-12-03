import {
	articleAuthorUsernameSchema,
	articleIdSchema,
	createArticleSchema,
	editArticleSchema
} from "$/lib/schemas/article";
import { limitCreatedAtCursorSchema, limitOffsetSchema } from "$/lib/schemas/helpers";
import { ArticleError } from "$/lib/utils/errors";
import { convertTagsToDBFormat } from "$/lib/utils/helpers";
import {
	connectTagsToArticleMutation,
	getArticleByIdQuery,
	getArticlesByAuthorIdQuery,
	getGlobalFeedQuery,
	getTagsByTextQuery,
	getTotalArticlesCountQuery,
	insertTagsMutation
} from "$/server/db/queries/article";
import { getUserByUsernameQuery } from "$/server/db/queries/auth";
import { article, articlesToTags } from "$/server/db/schema/article";
import { createTRPCRouter, privateProcedure, publicProcedure } from "$/server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const feeds = {
	getGlobalFeed: publicProcedure.input(limitOffsetSchema).query(async ({ ctx, input }) => {
		const [rawArticles, totalCount] = await Promise.all([
			getGlobalFeedQuery(ctx.db, input.limit, input.offset),
			getTotalArticlesCountQuery(ctx.db)
		]);

		// Replace raw likes with likes count
		const articles = rawArticles.map(({ likes, ...rest }) => ({ ...rest, likesCount: likes.length }));

		return { articles, totalCount };
	})
};

const queries = {
	getArticleById: publicProcedure.input(articleIdSchema).query(async ({ ctx, input }) => {
		const rawArticle = await getArticleByIdQuery(ctx.db, input);

		// Return null if article not found
		if (!rawArticle) return null;

		const { likes, ...rest } = rawArticle;
		const article = { ...rest, likesCount: likes.length };

		return article;
	}),

	getArticlesByAuthorUsername: publicProcedure
		.input(
			limitCreatedAtCursorSchema.extend({
				username: articleAuthorUsernameSchema
			})
		)
		.query(async ({ ctx, input }) => {
			const author = await getUserByUsernameQuery(ctx.db, input.username);
			if (!author) return null;

			const rawArticles = await getArticlesByAuthorIdQuery(ctx.db, author.id, input.limit, input.cursor);

			const articles = rawArticles.map(({ likes, ...rest }) => ({ ...rest, likesCount: likes.length }));

			return {
				articles,
				// Filter author for only fields we want to expose
				author: {
					id: author.id,
					username: author.username
				}
			};
		})
};

const mutations = {
	create: privateProcedure.input(createArticleSchema).mutation(async ({ input, ctx }) => {
		// Todo: Explore doing this in a transaction

		// Create article
		const newArticleQuery = ctx.db
			.insert(article)
			.values({
				...input,
				authorId: ctx.user.userId
			})
			.returning({ id: article.id });

		// Convert tags to format DB expects and create if needed
		const tagsToInsert = convertTagsToDBFormat(input.tags);
		const newTagsQuery = insertTagsMutation(ctx.db, tagsToInsert);

		// Run queries
		const [newArticles] = await Promise.all([newArticleQuery, newTagsQuery]);

		// Throw error if it didn't return the new article for some reason
		const articleId = newArticles[0]?.id;

		if (!articleId) {
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: new ArticleError("ARTICLE_FAILED_TO_CREATE") });
		}

		// Connect tags to article if needed
		if (input.tags && input.tags.length > 0) {
			const tags = await getTagsByTextQuery(ctx.db, input.tags);
			const tagIds = tags.map((tag) => tag.id);
			await connectTagsToArticleMutation(ctx.db, tagIds, articleId);
		}

		// For now, revalidate the entire site to reflect changes
		revalidatePath("/", "layout");

		return { success: true, articleId };
	}),

	editArticle: privateProcedure.input(editArticleSchema).mutation(async ({ ctx, input }) => {
		// Todo: Explore doing this in a transaction
		// Todo: Standardize naming of procedures and queries to CRUD language

		// Grab the article to be edited
		const a = await ctx.db.query.article.findFirst({
			where: ({ id }, { eq }) => eq(id, input.id)
		});

		// Check article exists
		if (!a) {
			throw new TRPCError({ code: "BAD_REQUEST", cause: new ArticleError("ARTICLE_NOT_FOUND") });
		}

		// Check article is owned by the user
		if (a.authorId !== ctx.user.userId) {
			throw new TRPCError({ code: "FORBIDDEN", cause: new ArticleError("ARTICLE_NOT_OWNED_BY_USER") });
		}

		const newValues = {
			...input,
			// Ensure id cannot be changed
			id: undefined,
			// Remove tags as it is not an accepted field
			tags: undefined
		};

		// Edit the article
		const editArticleQuery = ctx.db.update(article).set(newValues).where(eq(article.id, a.id));

		// Convert tags to format DB expects and create if needed
		const tagsToInsert = convertTagsToDBFormat(input.tags);
		const newTagsQuery = insertTagsMutation(ctx.db, tagsToInsert);

		// Remove all existing tags from the article; will reset them later
		const removeTagsQuery = ctx.db.delete(articlesToTags).where(eq(articlesToTags.articleId, a.id));

		// Run queries
		await Promise.all([newTagsQuery, editArticleQuery, removeTagsQuery]);

		// Connect tags to article if needed
		if (input.tags && input.tags.length > 0) {
			const tags = await getTagsByTextQuery(ctx.db, input.tags);
			const tagIds = tags.map((tag) => tag.id);
			await connectTagsToArticleMutation(ctx.db, tagIds, a.id);
		}

		// For now, revalidate the entire site to reflect changes
		revalidatePath("/", "layout");

		return { success: true };
	}),

	deleteArticle: privateProcedure.input(articleIdSchema).mutation(async ({ ctx, input }) => {
		const deletedArticles = await ctx.db
			.delete(article)
			.where(and(eq(article.id, input), eq(article.authorId, ctx.user.userId)))
			.returning();

		// Throw error if no article was deleted
		// Could be because user didn't have the right userId, or articleId wasn't found
		if (deletedArticles.length === 0) {
			throw new TRPCError({ code: "BAD_REQUEST", cause: new ArticleError("ARTICLE_FAILED_TO_DELETE") });
		}

		// For now, revalidate the entire site to reflect changes
		revalidatePath("/", "layout");

		return true;
	})
};

export const articleRouter = createTRPCRouter({
	...feeds,
	...queries,
	...mutations
});
