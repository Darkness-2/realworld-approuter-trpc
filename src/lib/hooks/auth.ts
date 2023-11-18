import { trpc } from "$/lib/trpc/client";

/**
 * Hook to get the current user.
 * Undefined if still loading, null if no user, otherwise will have a user object.
 * @returns standard useQuery items + the user object
 */
export const useUser = () => {
	const getCurrentUser = trpc.auth.getCurrentUser.useQuery(undefined, {
		refetchOnWindowFocus: false,
		// Only refetch the user every 5 minutes if needed
		staleTime: 1000 * 60 * 5
	});

	return {
		...getCurrentUser,
		user: getCurrentUser.data
	};
};
