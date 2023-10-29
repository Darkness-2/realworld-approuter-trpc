import { env } from "$/env.mjs";
import { pool } from "$/lib/server/db";
import { pg } from "@lucia-auth/adapter-postgresql";
import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import "lucia/polyfill/node";
import * as context from "next/headers";
import { cache } from "react";

export const auth = lucia({
	env: env.NODE_ENV == "production" ? "PROD" : "DEV",
	middleware: nextjs_future(),
	adapter: pg(pool, {
		key: `${env.TABLE_PREFIX}_user_key`,
		session: `${env.TABLE_PREFIX}_user_session`,
		user: `${env.TABLE_PREFIX}_auth_user`
	}),
	sessionCookie: {
		expires: false
	},
	getUserAttributes: (data) => {
		return {
			username: data.username
		};
	}
});

export type Auth = typeof auth;

export const getPageSession = cache(() => {
	const authRequest = auth.handleRequest("GET", context);
	return authRequest.validate();
});
