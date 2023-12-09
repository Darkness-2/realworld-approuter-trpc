import { type getServerTRPCClient } from "$/lib/trpc/serverClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { type ReactNode } from "react";

type TRPCHydrateProps = {
	children: ReactNode;
	serverTRPCClient: ReturnType<typeof getServerTRPCClient>;
};

/**
 * Custom component that wraps React Query's hydrate to be slightly friendlier to use for tRPC
 *
 * @see https://tanstack.com/query/v4/docs/react/guides/ssr#using-hydrate
 */
export default function TRPCHydrate({ children, serverTRPCClient }: TRPCHydrateProps) {
	// Note: Using React Query's dehydrate here instead of tRPC's built-in one as it seems to work better
	const dehydratedState = dehydrate(serverTRPCClient.queryClient);

	return <Hydrate state={dehydratedState}>{children}</Hydrate>;
}
