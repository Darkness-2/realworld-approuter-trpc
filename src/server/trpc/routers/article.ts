import { articleAuthorUsernameSchema, articleIdSchema, createArticleSchema } from "$/lib/schemas/article";
import { limitOffsetSchema } from "$/lib/schemas/helpers";
import { ArticleError } from "$/lib/utils/errors";
import { articleByIdQuery, articlesByAuthorId, countTotalArticles, globalFeedQuery } from "$/server/db/queries/article";
import { userByUsername } from "$/server/db/queries/auth";
import { article, articlesToTags, tag } from "$/server/db/schema/article";
import { createTRPCRouter, privateProcedure, publicProcedure } from "$/server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const articleRouter = createTRPCRouter({
	create: privateProcedure.input(createArticleSchema).mutation(async ({ input, ctx }) => {
		// Todo: Explore doing this in a transaction

		// Create article
		const newArticleQuery = ctx.db
			.insert(article)
			.values({
				authorId: ctx.user.userId,
				title: input.title,
				description: input.description,
				body: input.body
			})
			.returning({ id: article.id });

		// Convert tags to format DB expects and create if needed
		const tagsToInsert = input.tags?.map((tag) => ({ text: tag }));
		const newTagsQuery =
			tagsToInsert && tagsToInsert.length > 0 ? ctx.db.insert(tag).values(tagsToInsert).onConflictDoNothing() : null;

		// Run queries
		const [newArticles] = await Promise.all([newArticleQuery, newTagsQuery]);

		// Throw error if it didn't return the new article for some reason
		const articleId = newArticles[0]?.id;

		if (!articleId) {
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: new ArticleError("ARTICLE_FAILED_TO_CREATE") });
		}

		// Connect tags to article if needed
		if (input.tags && input.tags.length !== 0) {
			// Find all needed tags
			const tags = await ctx.db.query.tag.findMany({
				where: ({ text }) => inArray(text, input.tags ?? [])
			});

			// Generate connections needed and add to DB
			const articleTagConnections = tags.map((tag) => ({ tagId: tag.id, articleId }));
			await ctx.db.insert(articlesToTags).values(articleTagConnections);
		}

		// For now, revalidate the entire site to reflect changes
		revalidatePath("/", "layout");

		return { success: true, articleId };
	}),

	getGlobalFeed: publicProcedure.input(limitOffsetSchema).query(async ({ ctx, input }) => {
		const [articles, totalCount] = await Promise.all([
			globalFeedQuery(ctx.db, input.limit, input.offset),
			countTotalArticles(ctx.db)
		]);

		return { articles, totalCount };
	}),

	getArticleById: publicProcedure
		.input(articleIdSchema)
		.query(async ({ ctx, input }) => await articleByIdQuery(ctx.db, input)),

	getArticlesByAuthorUsername: publicProcedure
		.input(
			limitOffsetSchema.extend({
				username: articleAuthorUsernameSchema
			})
		)
		.query(async ({ ctx, input }) => {
			const author = await userByUsername(ctx.db, input.username);
			if (!author) return null;

			const articles = await articlesByAuthorId(ctx.db, author.id, input.limit, input.offset);

			return {
				articles,
				// Filter author for only fields we want to expose
				author: {
					id: author.id,
					username: author.username
				}
			};
		})
});
