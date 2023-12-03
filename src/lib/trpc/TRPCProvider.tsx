"use client";

import { createQueryClient, createTRPCClient, trpc } from "$/lib/trpc/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export default function TRPCProvider({ children }: { children: ReactNode }) {
	/**
	 * Ensures all requests get a unique client when rendering on the server
	 * @see https://trpc.io/docs/client/react/setup
	 */
	const [queryClient] = useState(() => createQueryClient());
	const [trpcClient] = useState(() => createTRPCClient());

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
}
