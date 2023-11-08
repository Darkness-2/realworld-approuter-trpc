import { createUserSchema, loginUserSchema, updatePasswordSchema, usernameCreateSchema } from "$/lib/schemas/auth";
import { AuthError } from "$/lib/utils/errors";
import { auth } from "$/server/auth/lucia";
import { key, user as userTable } from "$/server/db/schema/auth";
import { createTRPCRouter, privateProcedure, publicProcedure, requireRequestData } from "$/server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
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
					throw new TRPCError({ code: "UNAUTHORIZED", cause: new AuthError("INVALID_USERNAME_OR_PASSWORD") });
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
			// Handle expected Lucia errors that can happen above
			if (e instanceof LuciaError) {
				if (e.message === "AUTH_DUPLICATE_KEY_ID") {
					throw new TRPCError({ code: "BAD_REQUEST", cause: new AuthError("USERNAME_TAKEN") });
				}
			}

			// Handle possible database errors
			// See https://www.postgresql.org/docs/current/errcodes-appendix.html
			if (typeof e === "object" && e && "code" in e && e.code === "23505") {
				throw new TRPCError({ code: "BAD_REQUEST", cause: new AuthError("USERNAME_TAKEN") });
			}

			// Unexpected error occurred
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
	}),

	updateUsername: privateProcedure.input(usernameCreateSchema).mutation(async ({ ctx: { db, user }, input }) => {
		const oldUsername = user.username;
		const oldUsernameKey = `username:${oldUsername.toLowerCase()}`;
		const newUsername = input;
		const newUsernameKey = `username:${newUsername.toLowerCase()}`;

		// Todo: This should really be done in a transaction if possible
		try {
			// Get the old key for the hashed password
			const oldKey = await db.query.key.findFirst({
				where: ({ userId, id }, { eq, and }) => and(eq(userId, user.userId), eq(id, oldUsernameKey))
			});

			// Shouldn't happen, but if old key wasn't found, throw error
			if (!oldKey) {
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
			}

			// Add the new key for the new username
			await db.insert(key).values({
				id: newUsernameKey,
				userId: user.userId,
				hashedPassword: oldKey.hashedPassword
			});

			// Delete the old key
			await db.delete(key).where(eq(key.id, oldKey.id));

			// Update the user with new username
			await db.update(userTable).set({ username: newUsername }).where(eq(userTable.id, user.userId));
		} catch (e) {
			// Handle expected database errors
			// See https://www.postgresql.org/docs/current/errcodes-appendix.html
			if (typeof e === "object" && e && "code" in e && e.code === "23505") {
				throw new TRPCError({ code: "BAD_REQUEST", cause: new AuthError("USERNAME_TAKEN") });
			}

			// Unexpected error occurred
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
		}
	}),

	updatePassword: privateProcedure.input(updatePasswordSchema).mutation(async ({ ctx: { user }, input }) => {
		const { currentPassword, newPassword } = input;

		try {
			// Find user by key and validate the current password
			await auth.useKey("username", user.username.toLowerCase(), currentPassword);

			// Set new password
			const newKey = await auth.updateKeyPassword("username", user.username.toLowerCase(), newPassword);

			// Invalidate all existing sessions
			auth.invalidateAllUserSessions(newKey.userId);

			// Create new session
			const session = await auth.createSession({
				userId: newKey.userId,
				attributes: {}
			});

			// Handle the request and set the new session
			const authRequest = auth.handleRequest("POST", context);
			authRequest.setSession(session);

			// Clean up any dead user sessions
			await auth.deleteDeadUserSessions(session.user.userId);

			return true;
		} catch (e) {
			// Handle expected Lucia errors that can happen above
			if (e instanceof LuciaError) {
				if (e.message === "AUTH_INVALID_PASSWORD" || e.message === "AUTH_OUTDATED_PASSWORD") {
					throw new TRPCError({ code: "UNAUTHORIZED", cause: new AuthError("INVALID_USERNAME_OR_PASSWORD") });
				}
			}

			// Unexpected error occurred
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
		}
	})
});
