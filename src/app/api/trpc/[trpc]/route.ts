import { env } from "$/env.mjs";
import { appRouter } from "$/server/trpc/root";
import { createTRPCContext } from "$/server/trpc/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";

const handler = (req: NextRequest) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: () => {
			// Note: Calling headers here makes this API route uncacheable
			const source = headers().get("x-trpc-source") ?? "unknown";
			return createTRPCContext({ source });
		},
		onError:
			env.NODE_ENV === "development"
				? ({ path, error }) => {
						console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
				  }
				: undefined
	});

export { handler as GET, handler as POST };
