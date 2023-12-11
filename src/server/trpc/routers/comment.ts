import { createTRPCRouter } from "$/server/trpc/trpc";

const queries = {};

const mutations = {};

export const commentRouter = createTRPCRouter({
	...queries,
	...mutations
});
