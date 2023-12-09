import { toggleLikeSchema } from "$/lib/schemas/like";
import { getLikedArticlesQuery, likeArticleMutation, unlikeArticleMutation } from "$/server/db/queries/like";
import { createTRPCRouter, privateProcedure } from "$/server/trpc/trpc";
import { revalidatePath } from "next/cache";

// Todo: Get much more granular with revalidates; consider creating helper functions like "revalidateArticles, revalidateLikes"

const queries = {
	getLikedArticles: privateProcedure.query(async ({ ctx }) => {
		const rawLikes = await getLikedArticlesQuery(ctx.db, ctx.user.userId);
		const likes = rawLikes.map((l) => l.articleId);

		return likes;
	})
};

const mutations = {
	toggleLike: privateProcedure.input(toggleLikeSchema).mutation(async ({ ctx, input }) => {
		switch (input.action) {
			case "like":
				await likeArticleMutation(ctx.db, {
					articleId: input.articleId,
					userId: ctx.user.userId
				});
				break;

			case "unlike":
				await unlikeArticleMutation(ctx.db, {
					articleId: input.articleId,
					userId: ctx.user.userId
				});
				break;
		}

		// For now, revalidate entire site to update all like totals
		revalidatePath("/", "layout");

		return true;
	})
};

export const likeRouter = createTRPCRouter({
	...queries,
	...mutations
});
