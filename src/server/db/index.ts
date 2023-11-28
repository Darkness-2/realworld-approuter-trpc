import { env } from "$/env.mjs";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as articleSchema from "./schema/article";
import * as authSchema from "./schema/auth";
import * as followSchema from "./schema/follow";

// Todo: Determine if this needs to be cached per request as recommended in the Neon docs
// See: https://neon.tech/docs/serverless/serverless-driver#how-to-use-the-driver-over-http
// OR convert back to Neon http
export const pool = new Pool({
	connectionString: env.DATABASE_URL
});

export const db = drizzle(pool, {
	schema: { ...authSchema, ...articleSchema, ...followSchema },
	logger: env.NODE_ENV === "development"
});

export type DB = typeof db;
