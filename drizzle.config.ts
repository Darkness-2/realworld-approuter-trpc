import type { Config } from "drizzle-kit";
import { env } from "./src/env.mjs";

/**
 * Needed to get drizzle-kit to import aliases correctly
 */
import { register } from "tsconfig-paths";
import tsConfig from "./tsconfig.json";
const baseUrl = ".";
register({
	baseUrl,
	paths: tsConfig.compilerOptions.paths
});

export default {
	schema: "./src/lib/server/db/schema.ts",
	out: "./drizzle",
	driver: "pg",
	dbCredentials: {
		connectionString: env.DATABASE_URL
	},
	tablesFilter: [`${env.TABLE_PREFIX}_*`]
} satisfies Config;
