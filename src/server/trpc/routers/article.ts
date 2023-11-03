import { createArticleSchema } from "$/lib/schemas/article";
import { ArticleError } from "$/lib/utils/errors";
import { article, articlesToTags, tag } from "$/server/db/schema/article";
import { createTRPCRouter, privateProcedure } from "$/server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { inArray } from "drizzle-orm";

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
		const newTagsQuery = tagsToInsert ? ctx.db.insert(tag).values(tagsToInsert).onConflictDoNothing() : null;

		// Run queries
		const [newArticles] = await Promise.all([newArticleQuery, newTagsQuery]);

		// Throw error if it didn't return the new article for some reason
		const articleId = newArticles[0]?.id;

		if (!articleId) {
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: new ArticleError("ARTICLE_FAILED_TO_CREATE") });
		}

		// Connect tags to article if needed
		if (input.tags && input.tags.length === 0) {
			// Find all needed tags
			const tags = await ctx.db.query.tag.findMany({
				where: ({ text }) => inArray(text, input.tags ?? [])
			});

			// Generate connections needed and add to DB
			const articleTagConnections = tags.map((tag) => ({ tagId: tag.id, articleId }));
			await ctx.db.insert(articlesToTags).values(articleTagConnections);
		}

		return { success: true, articleId };
	})
});
