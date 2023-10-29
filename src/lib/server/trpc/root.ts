import { db } from "$/lib/server/db";
import { todos } from "$/lib/server/db/schema";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { cache } from "react";
import { z } from "zod";
import { createTRPCRouter, testProcedure } from "./trpc";

const generateString = cache(() => {
	console.log("Hello ran");
	return `Hey from the server at time: ${new Date().getTime()}`;
});

const getTodos = cache(async () => {
	console.log("Getting todos from DB");
	return await db.select().from(todos);
});

export const appRouter = createTRPCRouter({
	hello: testProcedure.query(() => generateString()),
	getTodos: testProcedure.query(async () => getTodos()),
	addTodo: testProcedure.input(z.string()).mutation(async ({ input }) => {
		await db.insert(todos).values({ content: input, done: false });
		return true;
	})
});

export type AppRouter = typeof appRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
