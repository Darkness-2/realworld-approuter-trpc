import { createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
	hello: publicProcedure.query(() => {
		return "Hey from the server";
	})
});

export type AppRouter = typeof appRouter;
