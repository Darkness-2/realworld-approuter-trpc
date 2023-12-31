import { getTRPCUrl } from "$/lib/trpc/shared";
import { type AppRouter } from "$/server/trpc/root";
import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink, httpLink, loggerLink, splitLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>({});

const generateTRPCHeaders = () => ({
	// Todo: Is it even possible to trigger this client server-side?
	"x-trpc-source": typeof window !== "undefined" ? "client" : "server-component"
});

export const createTRPCClient = () =>
	trpc.createClient({
		transformer: superjson,
		links: [
			loggerLink({
				// Enables logging in the console when in development or when there are errors
				enabled: (opts) =>
					process.env.NODE_ENV === "development" || (opts.direction === "down" && opts.result instanceof Error)
			}),

			// Use batching by default, but provide opt-out via context.skipBatch
			splitLink({
				condition: (op) => op.context.skipBatch === true,
				true: httpLink({
					url: getTRPCUrl(),
					headers: generateTRPCHeaders
				}),
				false: httpBatchLink({
					url: getTRPCUrl(),
					maxURLLength: 2083,
					headers: generateTRPCHeaders
				})
			})
		]
	});

export const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false
			}
		}
	});
