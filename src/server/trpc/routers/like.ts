import { articleIdSchema } from "$/lib/schemas/article";
import { like } from "$/server/db/schema/like";
import { createTRPCRouter, privateProcedure } from "$/server/trpc/trpc";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Queries
 */
const queries = {
	getLikedArticles: privateProcedure.query(
		async ({ ctx }) =>
			await ctx.db.query.like.findMany({
				columns: { articleId: true },
				where: ({ userId }, { eq }) => eq(userId, ctx.user.userId)
			})
	)
};

/**
 * Mutations
 */
const mutations = {
	likeArticle: privateProcedure.input(articleIdSchema).mutation(async ({ ctx, input }) => {
		await ctx.db
			.insert(like)
			.values({
				articleId: input,
				userId: ctx.user.userId
			})
			// Do nothing as like might already exist
			.onConflictDoNothing();

		// For now, revalidate entire site to update all like totals
		revalidatePath("/", "layout");

		return true;
	}),

	unlikeArticle: privateProcedure.input(articleIdSchema).mutation(async ({ ctx, input }) => {
		await ctx.db.delete(like).where(and(eq(like.articleId, input), eq(like.userId, ctx.user.userId)));

		// For now, revalidate entire site to update all like totals
		// Todo: Get much more granular with revalidates; consider creating helper functions like "revalidateArticles, revalidateLikes"
		revalidatePath("/", "layout");

		return true;
	})
};

export const likeRouter = createTRPCRouter({
	...queries,
	...mutations
});
