import { articleRouter } from "$/server/trpc/routers/article";
import { authRouter } from "$/server/trpc/routers/auth";
import { commentRouter } from "$/server/trpc/routers/comment";
import { followRouter } from "$/server/trpc/routers/follow";
import { likeRouter } from "$/server/trpc/routers/like";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	auth: authRouter,
	article: articleRouter,
	comment: commentRouter,
	follow: followRouter,
	like: likeRouter
});

export type AppRouter = typeof appRouter;
