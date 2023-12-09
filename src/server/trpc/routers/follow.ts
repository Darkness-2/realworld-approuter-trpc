import { toggleFollowSchema } from "$/lib/schemas/follow";
import { deleteFollow, getAuthorsFollowingQuery, insertFollow } from "$/server/db/queries/follow";
import { createTRPCRouter, privateProcedure } from "$/server/trpc/trpc";

const queries = {
	getAuthorsFollowing: privateProcedure.query(async ({ ctx }) => {
		const rawFollows = await getAuthorsFollowingQuery(ctx.db, ctx.user.userId);
		const follows = rawFollows.map((f) => f.authorId);

		return follows;
	})
};

const mutations = {
	toggleFollow: privateProcedure.input(toggleFollowSchema).mutation(async ({ ctx, input }) => {
		switch (input.action) {
			case "follow":
				await insertFollow(ctx.db, {
					authorId: input.authorId,
					userId: ctx.user.userId
				});
				break;

			case "unfollow":
				await deleteFollow(ctx.db, {
					authorId: input.authorId,
					userId: ctx.user.userId
				});
				break;
		}

		return true;
	})
};

export const followRouter = createTRPCRouter({
	...queries,
	...mutations
});
