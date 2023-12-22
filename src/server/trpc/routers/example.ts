import { messageNameSchema } from "$/lib/schemas/example";
import { generateBasicMessage, generateExpensiveMessage, generatePersonalizedMessage } from "$/lib/utils/example";
import { createTRPCRouter, publicProcedure } from "$/server/trpc/trpc";

export const exampleRouter = createTRPCRouter({
	getBasicMessage: publicProcedure.query(async () => {
		return await generateBasicMessage();
	}),
	getExpensiveMessage: publicProcedure.query(async () => {
		return await generateExpensiveMessage();
	}),
	generatePersonalizedMessage: publicProcedure.input(messageNameSchema).mutation(async ({ input }) => {
		return await generatePersonalizedMessage(input);
	})
});
