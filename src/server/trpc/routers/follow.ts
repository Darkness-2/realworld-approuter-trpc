import { userIdSchema } from "$/lib/schemas/auth";
import { deleteFollow, getAuthorsFollowingQuery, insertFollow } from "$/server/db/queries/follow";
import { createTRPCRouter, privateProcedure } from "$/server/trpc/trpc";

// Todo: Move all DB queries and mutations into db queries folder

export const followRouter = createTRPCRouter({
	follow: privateProcedure.input(userIdSchema).mutation(async ({ ctx, input }) => {
		await insertFollow(ctx.db, {
			authorId: input,
			userId: ctx.user.userId
		});

		return true;
	}),

	unfollow: privateProcedure.input(userIdSchema).mutation(async ({ ctx, input }) => {
		await deleteFollow(ctx.db, {
			authorId: input,
			userId: ctx.user.userId
		});

		return true;
	}),

	getAuthorsFollowing: privateProcedure.query(
		async ({ ctx }) => await getAuthorsFollowingQuery(ctx.db, ctx.user.userId)
	)
});
