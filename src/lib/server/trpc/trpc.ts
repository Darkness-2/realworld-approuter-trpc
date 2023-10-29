import { initTRPC } from "@trpc/server";
import { cache } from "react";

const t = initTRPC.create();

const someMiddleware = cache(() => {
	console.log("Middleware ran");
});

const testMiddleware = t.middleware(async ({ next }) => {
	someMiddleware();
	return next();
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const testProcedure = t.procedure.use(testMiddleware);
