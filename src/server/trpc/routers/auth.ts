import { loginUserSchema } from "$/lib/schemas/auth";
import { auth } from "$/server/auth/lucia";
import { createTRPCRouter, publicProcedure } from "$/server/trpc/trpc";
import * as context from "next/headers";

export const authRouter = createTRPCRouter({
	login: publicProcedure.input(loginUserSchema).mutation(async ({ input }) => {
		const { username, password } = input;

		try {
			// Find user by key and validate the password
			const key = await auth.useKey("username", username.toLowerCase(), password);

			// If key found, start a session
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});

			// Handle the request and set the new session
			const authRequest = auth.handleRequest("POST", context);
			authRequest.setSession(session);

			return { success: true as const, redirectTo: "/" };
		} catch (e) {
			// Todo: Handle errors better
			return { success: false as const };
		}
	})
});
