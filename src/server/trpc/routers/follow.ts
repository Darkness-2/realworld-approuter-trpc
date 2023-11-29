import { userIdSchema } from "$/lib/schemas/auth";
import { follow } from "$/server/db/schema/follow";
import { createTRPCRouter, privateProcedure } from "$/server/trpc/trpc";
import { and, eq } from "drizzle-orm";

// Todo: Move all DB queries and mutations into db queries folder

export const followRouter = createTRPCRouter({
	follow: privateProcedure.input(userIdSchema).mutation(async ({ ctx, input }) => {
		await ctx.db
			.insert(follow)
			.values({
				authorId: input,
				userId: ctx.user.userId
			})
			// Do nothing as follow relationship might already exist
			.onConflictDoNothing();

		return true;
	}),

	unfollow: privateProcedure.input(userIdSchema).mutation(async ({ ctx, input }) => {
		await ctx.db.delete(follow).where(and(eq(follow.userId, ctx.user.userId), eq(follow.authorId, input)));

		return true;
	}),

	checkIfFollowing: privateProcedure.input(userIdSchema).query(async ({ ctx, input }) => {
		const f = await ctx.db.query.follow.findFirst({
			where: ({ authorId, userId }, { and, eq }) => and(eq(authorId, input), eq(userId, ctx.user.userId))
		});

		if (f) return true;

		return false;
	}),

	getAuthorsFollowing: privateProcedure.query(
		async ({ ctx }) =>
			await ctx.db.query.follow.findMany({
				columns: { authorId: true },
				where: ({ userId }, { eq }) => eq(userId, ctx.user.userId)
			})
	)
});
