import { articleIdSchema } from "$/lib/schemas/article";
import { limitDateCursorSchema } from "$/lib/schemas/helpers";
import { getArticleCommentsQuery } from "$/server/db/queries/comment";
import { createTRPCRouter, publicProcedure } from "$/server/trpc/trpc";

const queries = {
	getArticleComments: publicProcedure
		.input(
			limitDateCursorSchema.extend({
				articleId: articleIdSchema
			})
		)
		.query(async ({ ctx, input }) => {
			// Grab one more than limit so we can tell if there are more comments
			const comments = await getArticleCommentsQuery(ctx.db, input.articleId, input.limit + 1, input.cursor);

			// Determine if we have a next page
			const hasMore = comments.length > input.limit;

			// Pop last one as we grabbed more than needed
			if (hasMore) comments.pop();

			return { comments, hasMore };
		})
};

const mutations = {};

export const commentRouter = createTRPCRouter({
	...queries,
	...mutations
});
