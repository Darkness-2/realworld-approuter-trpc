import { env } from "$/env.mjs";
import { pool } from "$/server/db";
import { pg } from "@lucia-auth/adapter-postgresql";
import { lucia, type Session } from "lucia";
import { nextjs_future } from "lucia/middleware";
import "lucia/polyfill/node";
import * as context from "next/headers";
import { cache } from "react";

/**
 * Lucia auth setup
 * @see https://lucia-auth.com/guidebook/sign-in-with-username-and-password/nextjs-app/
 */
export const auth = lucia({
	env: env.NODE_ENV === "production" ? "PROD" : "DEV",
	middleware: nextjs_future(),
	adapter: pg(pool, {
		key: `${env.TABLE_PREFIX}_user_key`,
		session: `${env.TABLE_PREFIX}_user_session`,
		user: `${env.TABLE_PREFIX}_auth_user`
	}),
	sessionCookie: {
		// Todo: look into why this is recommended
		// See: https://lucia-auth.com/guidebook/sign-in-with-username-and-password/nextjs-app/
		expires: false
	},
	getUserAttributes: (data) => {
		// Todo: Add createdAt and updatedAt attribute to users
		return {
			username: data.username
		};
	},
	experimental: {
		debugMode: env.NODE_ENV === "development"
	}
});

export type Auth = typeof auth;

/**
 * Helper function to set the user cookie given a specific session.
 * Should be called anytime we are changing the user's auth state.
 *
 * NOTE: Big limitation here is that even though a user cookie might be set,
 * it doesn't guarantee the user is actually logged in - the session might be expired.
 */
export const setUserCookie = (session: Session | null) => {
	// Remove user cookie if no session
	if (!session) {
		context.cookies().delete("user");
		return;
	}

	// Only include allowed fields
	const filteredUser = {
		userId: session.user.userId,
		username: session.user.username
	};

	// Stringify and set as a cookie
	// Todo: Consider JWT?
	const userJson = JSON.stringify(filteredUser);
	context.cookies().set("user", userJson, {
		path: "/",
		expires: session.idlePeriodExpiresAt,
		httpOnly: false,
		sameSite: "lax"
	});
};

/**
 * Recommended helper from Lucia that ensures we only validate the user's session once per request
 * @see https://lucia-auth.com/guidebook/sign-in-with-username-and-password/nextjs-app/#additional-notes
 */
export const getPageSession = cache((method: "GET" | "POST") => {
	// Todo: Should this always be GET?
	const authRequest = auth.handleRequest(method, context);
	return authRequest.validate();
});
