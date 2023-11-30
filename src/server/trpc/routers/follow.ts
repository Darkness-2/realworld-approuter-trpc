import { userIdSchema } from "$/lib/schemas/auth";
import { deleteFollow, getAuthorsFollowingQuery, insertFollow } from "$/server/db/queries/follow";
import { createTRPCRouter, privateProcedure } from "$/server/trpc/trpc";

const queries = {
	getAuthorsFollowing: privateProcedure.query(
		async ({ ctx }) => await getAuthorsFollowingQuery(ctx.db, ctx.user.userId)
	)
};

const mutations = {
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
	})
};

export const followRouter = createTRPCRouter({
	...queries,
	...mutations
});
