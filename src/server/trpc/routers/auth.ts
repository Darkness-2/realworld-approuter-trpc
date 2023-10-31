import { createUserSchema, loginUserSchema } from "$/lib/schemas/auth";
import { auth, setUserCookie } from "$/server/auth/lucia";
import { createTRPCRouter, publicProcedure } from "$/server/trpc/trpc";
import { TRPCError } from "@trpc/server";
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

			// Handle the request and set the new session and user cookie
			const authRequest = auth.handleRequest("POST", context);
			authRequest.setSession(session);
			setUserCookie(session);

			return { redirectTo: "/" };
		} catch (e) {
			// Todo: Handle errors better
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
		}
	}),

	signup: publicProcedure.input(createUserSchema).mutation(async ({ input }) => {
		const { username, password } = input;

		try {
			// Try to create the user
			const user = await auth.createUser({
				key: {
					providerId: "username",
					providerUserId: username.toLowerCase(),
					password
				},
				attributes: {
					username
				}
			});

			// Create a session for the new user
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			// Handle the request and set the new session
			const authRequest = auth.handleRequest("POST", context);
			authRequest.setSession(session);
			setUserCookie(session);

			return { redirectTo: "/" };
		} catch (e) {
			// Todo: Handle errors better
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
		}
	}),

	logout: publicProcedure.mutation(async () => {
		const authRequest = auth.handleRequest("POST", context);
		const session = await authRequest.validate();

		// User's not logged in, so just return null
		if (!session) {
			setUserCookie(null);
			return null;
		}

		// Invalidate the current session
		await auth.invalidateSession(session.sessionId);

		// Delete session and user cookies
		authRequest.setSession(null);
		setUserCookie(null);

		return { redirectTo: "/" };
	})
});
