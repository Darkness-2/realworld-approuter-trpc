import { follow } from "$/server/db/schema/follow";
import { relations } from "drizzle-orm";
import { bigint, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "../root";
import { article } from "./article";
import { comment } from "./comment";
import { like } from "./like";

/**
 * Tables for Lucia auth.
 * @see https://lucia-auth.com/getting-started/nextjs-app/
 *
 * Todo: Determine what needs to be indexed
 * Todo: Customize user ids
 */
export const user = pgTable("auth_user", {
	id: varchar("id", {
		length: 15 // Can be changed for custom user ids
	}).primaryKey(),
	username: varchar("username", { length: 64 }).notNull().unique()
});

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	keys: many(key),
	articles: many(article),
	comments: many(comment),
	likes: many(like),
	follows: many(follow, { relationName: "user" }),
	followers: many(follow, { relationName: "author" })
}));

export type User = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;

export const session = pgTable("user_session", {
	id: varchar("id", {
		length: 128
	}).primaryKey(),
	userId: varchar("user_id", {
		length: 15
	})
		.notNull()
		.references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
	activeExpires: bigint("active_expires", {
		mode: "number"
	}).notNull(),
	idleExpires: bigint("idle_expires", {
		mode: "number"
	}).notNull()
});

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

export type Session = typeof session.$inferSelect;
export type SessionInsert = typeof session.$inferInsert;

export const key = pgTable("user_key", {
	id: varchar("id", {
		length: 255
	}).primaryKey(),
	userId: varchar("user_id", {
		length: 15
	})
		.notNull()
		.references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
	hashedPassword: varchar("hashed_password", {
		length: 255
	})
});

export const keyRelations = relations(key, ({ one }) => ({
	user: one(user, {
		fields: [key.userId],
		references: [user.id]
	})
}));

export type Key = typeof key.$inferSelect;
export type KeyInsert = typeof key.$inferInsert;
