import { createUserSchema, loginUserSchema } from "$/lib/schemas/auth";
import { auth } from "$/server/auth/lucia";
import { createTRPCRouter, publicProcedure, requireRequestData } from "$/server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { LuciaError } from "lucia";
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

			// Clean up any dead user sessions
			await auth.deleteDeadUserSessions(session.user.userId);

			return { redirectTo: "/" };
		} catch (e) {
			// Handle expected Lucia errors that can happen above
			if (e instanceof LuciaError) {
				if (e.message === "AUTH_INVALID_PASSWORD" || e.message === "AUTH_INVALID_KEY_ID") {
					throw new TRPCError({ code: "UNAUTHORIZED", message: "Your username or password are incorrect" });
				}
			}

			// Unexpected error occurred
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

			return { redirectTo: "/" };
		} catch (e) {
			// Todo: Handle errors better
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
		}
	}),

	logout: publicProcedure.mutation(async () => {
		const authRequest = auth.handleRequest("POST", context);
		const session = await authRequest.validate();

		// If session exists, invalidate the current session and clean up any dead user sessions
		if (session) {
			await auth.invalidateSession(session.sessionId);
			await auth.deleteDeadUserSessions(session.user.userId);
		}

		// Delete session cookie regardless
		authRequest.setSession(null);

		return { redirectTo: "/" };
	}),

	getCurrentUser: publicProcedure.use(requireRequestData).query(({ ctx: { user } }) => {
		if (!user) return null;

		// Filter user for only fields we want to expose
		return {
			username: user.username,
			userId: user.userId
		};
	})
});
