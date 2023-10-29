import { appRouter } from "$/lib/server/trpc/root";
import { createTRPCContext } from "$/lib/server/trpc/trpc";
import { cookies, headers } from "next/headers";
import { cache } from "react";

/**
 * Factory to create server-side callers for tRPC
 * Needed as this ensures every request will get a new caller
 * @returns a server-side caller for tRPC
 */
export const createServerClient = () => {
	console.log(`Created a caller at time: ${new Date().getTime()}`);
	const context = createTRPCContext(headers(), cookies());
	return appRouter.createCaller(context);
};

/**
 * React cache wrapper around the factory to avoid the overhead of generating a new caller if
 * it is used in multiple places in a single request (for example in two separate server components).
 *
 * Should avoid the context being created multiple times.
 */
export const getServerClient = cache(createServerClient);
