import { relations } from "drizzle-orm";
import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "../root";
import { user } from "./auth";

/**
 * Represents a follow relationship.
 * userId is the follower
 * authorId is the author the user is following
 */
export const follow = pgTable(
	"follow",
	{
		userId: varchar("user_id", {
			length: 15
		})
			.notNull()
			.references(() => user.id),
		authorId: varchar("author_id", {
			length: 15
		})
			.notNull()
			.references(() => user.id)
	},
	(t) => ({
		pk: primaryKey({ columns: [t.authorId, t.userId] })
	})
);

export const followRelations = relations(follow, ({ one }) => ({
	user: one(user, {
		fields: [follow.userId],
		references: [user.id],
		relationName: "user"
	}),
	author: one(user, {
		fields: [follow.authorId],
		references: [user.id],
		relationName: "author"
	})
}));
