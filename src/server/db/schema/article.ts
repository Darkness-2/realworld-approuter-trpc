import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { char, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "../root";
import { user } from "./auth";

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
		.references(() => user.id),
	createdAt: timestamp("created_at").notNull().defaultNow()
});

export const articleRelations = relations(article, ({ one, many }) => ({
	articlesToTags: many(articlesToTags),
	author: one(user, {
		fields: [article.authorId],
		references: [user.id]
	})
}));

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
	articlesToTags: many(articlesToTags)
}));

/**
 * Article-to-Tag many-to-many relationship table.
 */
export const articlesToTags = pgTable(
	"articles_to_tags",
	{
		articleId: char("article_id", {
			length: 24
		})
			.notNull()
			.references(() => article.id),
		tagId: char("tag_id", {
			length: 24
		})
			.notNull()
			.references(() => tag.id)
	},
	(t) => ({
		pk: primaryKey(t.articleId, t.tagId)
	})
);

export const articlesToTagsRelations = relations(articlesToTags, ({ one }) => ({
	article: one(article, {
		fields: [articlesToTags.articleId],
		references: [article.id]
	}),
	tag: one(tag, {
		fields: [articlesToTags.tagId],
		references: [tag.id]
	})
}));
