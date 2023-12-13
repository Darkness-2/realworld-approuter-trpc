import { articleIdSchema } from "$/lib/schemas/article";
import { commentIdSchema, createCommentSchema } from "$/lib/schemas/comment";
import { limitDateCursorSchema } from "$/lib/schemas/helpers";
import { CommentError } from "$/lib/utils/errors";
import { createCommentMutation, deleteCommentMutation, getArticleCommentsQuery } from "$/server/db/queries/comment";
import { createTRPCRouter, privateProcedure, publicProcedure } from "$/server/trpc/trpc";
import { TRPCError } from "@trpc/server";

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

const mutations = {
	create: privateProcedure.input(createCommentSchema).mutation(async ({ ctx, input }) => {
		// Create the new comment
		const newComments = await createCommentMutation(ctx.db, {
			...input,
			authorId: ctx.user.userId
		});

		const newComment = newComments?.[0];

		// Throw an error if the comment wasn't returned for some reason
		if (!newComment) {
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: new CommentError("COMMENT_FAILED_TO_RETURN") });
		}

		return { success: true, comment: newComment };
	}),

	delete: privateProcedure.input(commentIdSchema).mutation(async ({ ctx, input }) => {
		const deletedComments = await deleteCommentMutation(ctx.db, input, ctx.user.userId);

		if (deletedComments.length === 0) {
			throw new TRPCError({ code: "BAD_REQUEST", cause: new CommentError("COMMENT_FAILED_TO_DELETE") });
		}

		return true;
	})
};

export const commentRouter = createTRPCRouter({
	...queries,
	...mutations
});
