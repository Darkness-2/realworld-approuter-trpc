import { env } from "$/env.mjs";
import { boolean, pgTableCreator, serial, text } from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `${env.TABLE_PREFIX}_${name}`);

export const todos = pgTable("todos", {
	id: serial("id").primaryKey(),
	content: text("content"),
	done: boolean("done")
});
