import { generateBasicMessage, generateExpensiveMessage, generatePersonalizedMessage } from "$/lib/utils/example";
import { createTRPCRouter, publicProcedure } from "$/server/trpc/trpc";
import { z } from "zod";

export const exampleRouter = createTRPCRouter({
	getBasicMessage: publicProcedure.query(async () => {
		return await generateBasicMessage();
	}),
	getExpensiveMessage: publicProcedure.query(async () => {
		return await generateExpensiveMessage();
	}),
	generatePersonalizedMessage: publicProcedure.input(z.string().min(1)).mutation(async ({ input }) => {
		return await generatePersonalizedMessage(input);
	})
});
