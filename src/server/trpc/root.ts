import { articleRouter } from "$/server/trpc/routers/article";
import { authRouter } from "$/server/trpc/routers/auth";
import { followRouter } from "$/server/trpc/routers/follow";
import { cache } from "react";
import { createTRPCRouter, publicProcedure } from "./trpc";

const generateString = cache(() => {
	console.log("Hello ran");
	return `Hey from the server at time: ${new Date().getTime()}`;
});

export const appRouter = createTRPCRouter({
	hello: publicProcedure.query(() => generateString()),
	auth: authRouter,
	article: articleRouter,
	follow: followRouter
});

export type AppRouter = typeof appRouter;
