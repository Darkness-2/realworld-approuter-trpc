import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { char, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "../root";
import { user } from "./auth";
import { comment } from "./comment";
import { like } from "./like";

export const article = pgTable("article", {
	id: char("id", {
		length: 24
	})
		.$defaultFn(createId)
		.primaryKey(),
	title: varchar("title", {
		length: 128
	}).notNull(),
	description: varchar("description", {
		length: 256
	}).notNull(),
	body: text("body").notNull(),
	authorId: varchar("author_id", {
		length: 15
	})
		.notNull()
		.references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow()
});

export const articleRelations = relations(article, ({ one, many }) => ({
	articlesToTags: many(articleToTag),
	author: one(user, {
		fields: [article.authorId],
		references: [user.id]
	}),
	comments: many(comment),
	likes: many(like)
}));

export type Article = typeof article.$inferSelect;
export type ArticleInsert = typeof article.$inferInsert;

// Todo: Consider breaking tag out into a separate schema

export const tag = pgTable("tag", {
	id: char("id", {
		length: 24
	})
		.$defaultFn(createId)
		.primaryKey(),
	text: varchar("text", {
		length: 32
	})
		.notNull()
		.unique()
});

export const tagRelations = relations(tag, ({ many }) => ({
	articlesToTags: many(articleToTag)
}));

export type Tag = typeof tag.$inferSelect;
export type TagInsert = typeof tag.$inferInsert;

/**
 * Article-to-tag many-to-many relationship table.
 */
export const articleToTag = pgTable(
	"article_to_tag",
	{
		articleId: char("article_id", {
			length: 24
		})
			.notNull()
			.references(() => article.id, { onDelete: "cascade", onUpdate: "cascade" }),
		tagId: char("tag_id", {
			length: 24
		})
			.notNull()
			.references(() => tag.id, { onDelete: "cascade", onUpdate: "cascade" })
	},
	(t) => ({
		pk: primaryKey({ columns: [t.articleId, t.tagId] })
	})
);

export const articleToTagRelations = relations(articleToTag, ({ one }) => ({
	article: one(article, {
		fields: [articleToTag.articleId],
		references: [article.id]
	}),
	tag: one(tag, {
		fields: [articleToTag.tagId],
		references: [tag.id]
	})
}));

export type ArticleToTag = typeof articleToTag.$inferSelect;
export type ArticleToTagInsert = typeof articleToTag.$inferInsert;
