import { appRouter } from "$/server/trpc/root";
import { createTRPCContext } from "$/server/trpc/trpc";
import { cache } from "react";

/**
 * Factory to create server-side callers for tRPC
 * Needed as this ensures every request will get a new caller
 * @returns a server-side caller for tRPC
 */
export const createServerClient = () => {
	console.log(`Created a caller at time: ${new Date().getTime()}`);
	const context = createTRPCContext();
	return appRouter.createCaller(context);
};

/**
 * React cache wrapper around the factory to avoid the overhead of generating a new caller if
 * it is used in multiple places in a single request (for example in two separate server components).
 *
 * Should avoid the context being created multiple times.
 *
 * Todo: Consider if this needs to be wrapped in cache given I moved most context stuff into middleware.
 */
export const getServerClient = cache(createServerClient);
