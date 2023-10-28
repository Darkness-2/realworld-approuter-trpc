import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string()
	},
	client: {},
	runtimeEnv: {
		DATABASE_URL: process.env.DRIZZLE_DATABASE_URL
	}
});
