import { relations } from "drizzle-orm";
import { char, primaryKey, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "../root";
import { article } from "./article";
import { user } from "./auth";

export const like = pgTable(
	"like",
	{
		articleId: char("article_id", {
			length: 24
		})
			.notNull()
			.references(() => article.id, { onDelete: "cascade", onUpdate: "cascade" }),
		userId: varchar("user_id", {
			length: 15
		})
			.notNull()
			.references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" })
	},
	(t) => ({
		pk: primaryKey({ columns: [t.articleId, t.userId] })
	})
);

export const likeRelations = relations(like, ({ one }) => ({
	article: one(article, {
		fields: [like.articleId],
		references: [article.id]
	}),
	user: one(user, {
		fields: [like.userId],
		references: [user.id]
	})
}));

export type Like = typeof like.$inferSelect;
export type LikeInsert = typeof like.$inferInsert;
