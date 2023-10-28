import type { AppRouter } from "$/lib/server/trpc/root";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>({});
export const createTRPCClient = () =>
	trpc.createClient({
		links: [
			httpBatchLink({
				url: "http://localhost:3000/api/trpc"
			})
		]
	});
