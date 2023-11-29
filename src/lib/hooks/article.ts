import { trpc } from "$/lib/trpc/client";

/**
 * Hook to get the user's liked articles.
 * Undefined if still loading, otherwise returns an array of liked articles.
 * @returns standard useQuery items + the likedArticles array
 */
export const useLikedArticles = () => {
	const likedArticles = trpc.article.getLikedArticles.useQuery(undefined, {
		refetchOnWindowFocus: false,
		// Only refetch the user's liked articles every 5 minutes if needed
		staleTime: 1000 * 60 * 5
	});

	return {
		...likedArticles,
		likedArticles: likedArticles.data
	};
};
