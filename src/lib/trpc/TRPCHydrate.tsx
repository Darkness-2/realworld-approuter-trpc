import { getServerTRPCClient } from "$/lib/trpc/serverClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { type ReactNode } from "react";

/**
 * Custom component that wraps React Query's hydrate to be slightly friendlier to use for tRPC
 *
 * @see https://tanstack.com/query/v4/docs/react/guides/ssr#using-hydrate
 */
export default function TRPCHydrate({ children }: { children?: ReactNode }) {
	const serverClient = getServerTRPCClient();

	// Note: Using React Query's dehydrate here instead of tRPC's built-in one as it seems to work better
	const dehydratedState = dehydrate(serverClient.queryClient);

	return <Hydrate state={dehydratedState}>{children}</Hydrate>;
}
