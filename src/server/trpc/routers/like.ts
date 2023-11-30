import { articleIdSchema } from "$/lib/schemas/article";
import { getLikedArticlesQuery, likeArticleMutation, unlikeArticleMutation } from "$/server/db/queries/like";
import { createTRPCRouter, privateProcedure } from "$/server/trpc/trpc";
import { revalidatePath } from "next/cache";

// Todo: Get much more granular with revalidates; consider creating helper functions like "revalidateArticles, revalidateLikes"

const queries = {
	getLikedArticles: privateProcedure.query(async ({ ctx }) => await getLikedArticlesQuery(ctx.db, ctx.user.userId))
};

const mutations = {
	likeArticle: privateProcedure.input(articleIdSchema).mutation(async ({ ctx, input }) => {
		await likeArticleMutation(ctx.db, {
			articleId: input,
			userId: ctx.user.userId
		});

		// For now, revalidate entire site to update all like totals
		revalidatePath("/", "layout");

		return true;
	}),

	unlikeArticle: privateProcedure.input(articleIdSchema).mutation(async ({ ctx, input }) => {
		await unlikeArticleMutation(ctx.db, {
			articleId: input,
			userId: ctx.user.userId
		});

		// For now, revalidate entire site to update all like totals
		revalidatePath("/", "layout");

		return true;
	})
};

export const likeRouter = createTRPCRouter({
	...queries,
	...mutations
});
