import { trpc } from "$/lib/trpc/client";

/**
 * Hook to get the authors the user is following.
 * Undefined if still loading, otherwise returns an array of following relationships.
 * @returns standard useQuery items + the authorsFollowing array
 */
export const useFollows = () => {
	const authorsFollowing = trpc.follow.getAuthorsFollowing.useQuery(undefined, {
		// Only refetch the user's followers every 5 minutes if needed
		staleTime: 1000 * 60 * 5
	});

	return {
		...authorsFollowing,
		authorsFollowing: authorsFollowing.data
	};
};
