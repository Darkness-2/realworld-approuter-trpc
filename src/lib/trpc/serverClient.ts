import { appRouter } from "$/lib/server/trpc/root";
import { cache } from "react";

/**
 * Factory to create server-side callers for tRPC
 * Needed as this ensures every request will get a new caller
 * Todo: Get context creation into this thing
 * @returns a server-side caller for tRPC
 */
export const createServerClient = () => {
	console.log(`Created a caller at time: ${new Date().getTime()}`);
	return appRouter.createCaller({});
};

/**
 * Wrapper around the factory using React cache to avoid the overhead of generating a new caller if
 * it is used in multiple places in a single request (for example in two separate server components).
 *
 * Should also avoid the context being created multiple times.
 */
export const getServerClient = cache(createServerClient);
