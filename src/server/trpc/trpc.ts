import { env } from "$/env.mjs";
import { AuthError } from "$/lib/utils/errors";
import { getPageSession } from "$/server/auth/lucia";
import { db } from "$/server/db";
import { TRPCError, initTRPC } from "@trpc/server";
import { cookies, headers } from "next/headers";
import superjson from "superjson";
import { ZodError } from "zod";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */
interface CreateContextOptions {
	source: string;
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
export const createInnerTRPCContext = (opts: CreateContextOptions) => {
	return {
		...opts,
		db
	};
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = (opts: { source: CreateContextOptions["source"] }) => {
	return createInnerTRPCContext({ ...opts });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter: ({ shape, error }) => ({
		// Todo: Check if this exposes anything sensitive to client
		...shape,
		data: {
			...shape.data,
			zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
			authError: error.cause instanceof AuthError ? error.cause.code : null
		}
	})
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware to console.log where the tRPC request is coming from, enabled only in dev.
 *
 * client = coming from the browser
 * server-component = coming from the tRPC client, but from the server through HTTP request
 * server = coming from the tRPC serverClient, without a HTTP request
 */
const logTRPCSource = t.middleware(async ({ ctx, path, next }) => {
	if (env.NODE_ENV === "development") {
		console.log(`\n${new Date().toLocaleTimeString()}  ▶️  Processing tRPC request for ${path} from ${ctx.source}`);
	}

	const res = await next();

	if (env.NODE_ENV === "development" && !res.ok) {
		console.log(`${new Date().toLocaleTimeString()}  ❌ tRPC failed on ${path ?? "<no-path>"}: ${res.error.message}`);
	}

	return res;
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API.
 * Should be cacheable as it doesn't leverage headers or cookies.
 */
export const publicProcedure = t.procedure.use(logTRPCSource);

/**
 * Helper function to grab data related to an individual request.
 * @returns headers, cookies, session, and user for the request
 */
const getRequestData = async (type: "query" | "mutation" | "subscription") => {
	// Grab Next.js headers and cookies
	const nextHeaders = headers();
	const nextCookies = cookies();

	// Use POST for mutations and GET for other types of requests
	const method = type === "mutation" ? "POST" : "GET";

	// Grab auth info from Lucia
	const session = await getPageSession(method);

	return {
		cookies: nextCookies,
		headers: nextHeaders,
		session,
		user: session?.user ?? null
	};
};

/**
 * Reusable middleware that populates per request data (headers, cookies, and user session).
 */
export const requireRequestData = t.middleware(async ({ next, type }) => {
	const requestData = await getRequestData(type);

	return next({
		ctx: {
			...requestData
		}
	});
});

/**
 * Reusable middleware that enforces users are logged in before running the procedure.
 * Note: In the future would be better to use tRPC's pipe feature (currently unstable)
 * @see https://trpc.io/docs/server/middlewares#extending-middlewares
 */
const enforceUserIsAuthed = t.middleware(async ({ next, type }) => {
	const requestData = await getRequestData(type);

	if (!requestData.session) {
		throw new TRPCError({ code: "UNAUTHORIZED", cause: new AuthError("USER_IS_UNAUTHORIZED") });
	}

	return next({
		ctx: {
			...requestData,
			session: requestData.session,
			user: requestData.session.user
		}
	});
});

/**
 * Private (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session and ctx.user` is not null.
 */
export const privateProcedure = t.procedure.use(logTRPCSource).use(enforceUserIsAuthed);
