import type { Config } from "drizzle-kit";
import { env } from "./src/env.mjs";

export default {
	schema: "./src/server/db/schema.ts",
	out: "./drizzle",
	driver: "pg",
	dbCredentials: {
		connectionString: env.DATABASE_URL
	},
	tablesFilter: [`${env.TABLE_PREFIX}_*`]
} satisfies Config;
