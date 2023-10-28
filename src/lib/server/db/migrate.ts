import { db } from "$/lib/server/db";
import { migrate } from "drizzle-orm/neon-http/migrator";

const runMigrations = async () => {
	await migrate(db, { migrationsFolder: "drizzle" });
};

runMigrations();
