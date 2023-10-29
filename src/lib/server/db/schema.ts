import { bigint, pgTableCreator, varchar } from "drizzle-orm/pg-core";
import { env } from "../../../env.mjs";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM.
 * Allows for use of the same database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
const pgTable = pgTableCreator((name) => `${env.TABLE_PREFIX}_${name}`);

/**
 * Tables for Lucia auth.
 * @see https://lucia-auth.com/getting-started/nextjs-app/
 */
export const user = pgTable("auth_user", {
	id: varchar("id", {
		length: 15 // Can be changed for custom user ids
	}).primaryKey(),
	username: varchar("username", { length: 64 }).notNull().unique()
});

export const session = pgTable("user_session", {
	id: varchar("id", {
		length: 128
	}).primaryKey(),
	userId: varchar("user_id", {
		length: 15
	})
		.notNull()
		.references(() => user.id),
	activeExpires: bigint("active_expires", {
		mode: "number"
	}).notNull(),
	idleExpires: bigint("idle_expires", {
		mode: "number"
	}).notNull()
});

export const key = pgTable("user_key", {
	id: varchar("id", {
		length: 255
	}).primaryKey(),
	userId: varchar("user_id", {
		length: 15
	})
		.notNull()
		.references(() => user.id),
	hashedPassword: varchar("hashed_password", {
		length: 255
	})
});
