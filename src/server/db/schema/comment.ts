import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { char, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "../root";
import { article } from "./article";
import { user } from "./auth";

export const comment = pgTable("comment", {
	id: char("id", {
		length: 24
	})
		.$defaultFn(createId)
		.primaryKey(),
	body: text("body").notNull(),
	articleId: char("article_id", {
		length: 24
	})
		.notNull()
		.references(() => article.id, { onDelete: "cascade", onUpdate: "cascade" }),
	authorId: varchar("author_id", {
		length: 15
	})
		.notNull()
		.references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow()
});

export const commentRelations = relations(comment, ({ one }) => ({
	article: one(article, {
		fields: [comment.articleId],
		references: [article.id]
	}),
	author: one(user, {
		fields: [comment.authorId],
		references: [user.id]
	})
}));

export type Comment = typeof comment.$inferSelect;
export type CommentInsert = typeof comment.$inferInsert;
