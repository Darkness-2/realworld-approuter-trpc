import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { cache } from "react";
import { createTRPCRouter, publicProcedure } from "./trpc";

const generateString = cache(() => {
	console.log("Hello ran");
	return `Hey from the server at time: ${new Date().getTime()}`;
});

export const appRouter = createTRPCRouter({
	hello: publicProcedure.query(() => generateString())
});

export type AppRouter = typeof appRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
