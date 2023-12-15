import {
	articleAuthorUsernameSchema,
	articleIdSchema,
	createArticleSchema,
	editArticleSchema
} from "$/lib/schemas/article";
import { limitDateCursorSchema, limitOffsetSchema } from "$/lib/schemas/helpers";
import { ArticleError } from "$/lib/utils/errors";
import { convertTagsToDBFormat } from "$/lib/utils/helpers";
import {
	createArticleMutation,
	deleteArticleMutation,
	editArticleMutation,
	getArticleByIdQuery,
	getArticlesByAuthorIdQuery,
	getGlobalFeedQuery,
	getTotalArticlesCountQuery,
	getUserFeedArticlesCountQuery,
	getUserFeedQuery
} from "$/server/db/queries/article";
import { getUserByUsernameQuery } from "$/server/db/queries/auth";
import { createTRPCRouter, privateProcedure, publicProcedure } from "$/server/trpc/trpc";
import { TRPCError } from "@trpc/server";
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
	}),

	getUserFeed: privateProcedure.input(limitOffsetSchema).query(async ({ ctx, input }) => {
		// Todo: Deal with user following 0 users

		const [rawArticles, totalCount] = await Promise.all([
			getUserFeedQuery(ctx.db, ctx.user.userId, input.limit, input.offset),
			getUserFeedArticlesCountQuery(ctx.db, ctx.user.userId)
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
			limitDateCursorSchema.extend({
				username: articleAuthorUsernameSchema
			})
		)
		.query(async ({ ctx, input }) => {
			const author = await getUserByUsernameQuery(ctx.db, input.username);
			if (!author) return null;

			// Grab one more than limit so we can tell if there are more pages
			const rawArticles = await getArticlesByAuthorIdQuery(ctx.db, author.id, input.limit + 1, input.cursor);

			// Determine if we have a next page
			const hasMore = rawArticles.length > input.limit;

			// Pop last one if we grabbed more than needed
			if (hasMore) rawArticles.pop();

			const articles = rawArticles.map(({ likes, ...rest }) => ({ ...rest, likesCount: likes.length }));

			return {
				articles,
				// Filter author for only fields we want to expose
				author: {
					id: author.id,
					username: author.username
				},
				hasMore
			};
		})
};

const mutations = {
	create: privateProcedure.input(createArticleSchema).mutation(async ({ input, ctx }) => {
		// Convert tags to format DB expects and create if needed
		const tagsToInsert = convertTagsToDBFormat(input.tags);

		try {
			const articleId = await createArticleMutation(ctx.db, { ...input, authorId: ctx.user.userId }, tagsToInsert);

			// For now, revalidate the entire site to reflect changes
			revalidatePath("/", "layout");

			return { success: true, articleId };
		} catch (e) {
			// Handle expected errors
			if (e instanceof ArticleError) {
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: e });
			}

			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
		}
	}),

	edit: privateProcedure.input(editArticleSchema).mutation(async ({ ctx, input }) => {
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

		// Convert tags to format DB expects and create if needed
		const tagsToInsert = convertTagsToDBFormat(input.tags);

		await editArticleMutation(ctx.db, newValues, a.id, tagsToInsert);

		// For now, revalidate the entire site to reflect changes
		revalidatePath("/", "layout");

		return true;
	}),

	delete: privateProcedure.input(articleIdSchema).mutation(async ({ ctx, input }) => {
		const deletedArticles = await deleteArticleMutation(ctx.db, input, ctx.user.userId);

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
