import { userIdSchema } from "$/lib/schemas/auth";
import { follow } from "$/server/db/schema/follow";
import { createTRPCRouter, privateProcedure } from "$/server/trpc/trpc";
import { and, eq } from "drizzle-orm";

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
	})
});
