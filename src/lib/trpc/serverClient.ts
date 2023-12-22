import { appRouter } from "$/server/trpc/root";
import { createTRPCContext } from "$/server/trpc/trpc";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { cache } from "react";
import superjson from "superjson";

/**
 * Cached factory to get the tRPC server-side helpers.
 * Needed as this ensures every request gets a new, unique helper.
 *
 * NOTE: Intentionally avoiding the use of dynamic functions like headers and cookies,
 * in context creation in order to ensure that most pages are still cachable.
 *
 * @returns the tRPC server-side helpers
 * @see https://trpc.io/docs/client/nextjs/server-side-helpers
 */
export const getServerTRPCClient = cache(() =>
	createServerSideHelpers({
		router: appRouter,
		ctx: createTRPCContext({ source: "server-helpers" }),
		transformer: superjson
	})
);

/**
 * Cached factory to get a tRPC server-side caller.
 * Needed as this ensures every request get a new, unique helper.
 *
 * Useful to access mutations, but queries are preferred to use the server
 * helpers as they provide more functionality for client-side hydration.
 *
 * @returns a tRPC server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const getServerTRPCCaller = cache(() => appRouter.createCaller(createTRPCContext({ source: "server-caller" })));
