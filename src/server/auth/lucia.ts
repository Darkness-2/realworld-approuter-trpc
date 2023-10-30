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
 * Recommended helper from Lucia that ensures we only validate the user's session once per request
 * @see https://lucia-auth.com/guidebook/sign-in-with-username-and-password/nextjs-app/#additional-notes
 */
export const getPageSession = cache(() => {
	const authRequest = auth.handleRequest("GET", context);
	return authRequest.validate();
});
