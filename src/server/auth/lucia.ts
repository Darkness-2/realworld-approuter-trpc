import { env } from "$/env.mjs";
import { pool } from "$/server/db";
import { pg } from "@lucia-auth/adapter-postgresql";
import { lucia } from "lucia";
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
 * Recommended helper from Lucia that validates the user's session.
 * Wrapped in cache to ensure it is only called once per request.
 * CSRF protection is only applied for POST requests; it should be used for all mutations.
 *
 * @see https://lucia-auth.com/guidebook/sign-in-with-username-and-password/nextjs-app/#additional-notes
 */
export const getPageSession = cache((method: "GET" | "POST") => {
	const authRequest = auth.handleRequest(method, context);
	return authRequest.validate();
});
