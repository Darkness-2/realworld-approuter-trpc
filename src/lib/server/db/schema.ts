import { env } from "$/env.mjs";
import { pgTableCreator } from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `${env.TABLE_PREFIX}_${name}`);
