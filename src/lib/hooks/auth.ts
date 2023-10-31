import { trpc } from "$/lib/trpc/client";

/**
 * Hook to get the current user.
 * Undefined if still loading, null if no user, otherwise will have a user object.
 * @returns standard useQuery items + the user object
 */
export const useUser = () => {
	const getCurrentUser = trpc.auth.getCurrentUser.useQuery(undefined, {
		refetchOnWindowFocus: false
	});

	return {
		...getCurrentUser,
		user: getCurrentUser.data
	};
};
