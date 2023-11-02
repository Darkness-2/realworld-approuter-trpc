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
			const source = headers().get("x-trpc-source") ?? "unknown";
			return createTRPCContext({ source });
		}
		// Todo: explore creating cachable tRPC procedures
		// See: https://trpc.io/docs/server/caching
	});

export { handler as GET, handler as POST };
