import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { env } from "../../env.mjs";

const pool = new Pool({
	connectionString: env.DATABASE_URL,
	max: 1
});
const db = drizzle(pool);

migrate(db, { migrationsFolder: "drizzle" });
