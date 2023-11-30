import { type DB } from "$/server/db";
import { article, articlesToTags, tag, type TagInsert } from "$/server/db/schema/article";
import { sql } from "drizzle-orm";
import { cache } from "react";

/** Queries */

/**
 * Cached database call to get the data required for the global feed.
 * Sorted descending by createdAt date.
 *
 * Todo: Explore prepared statements for this, although that may not be possible on Neon
 * See: https://neon.tech/docs/connect/connection-pooling#connection-pooling-notes-and-limitations
 *
 * @param db instance of the DB
 * @param limit how many items to get
 * @param offset how many items to offset
 */
export const getGlobalFeedQuery = cache(
	async (db: DB, limit: number, offset: number) =>
		await db.query.article.findMany({
			columns: { body: false },
			orderBy: ({ createdAt }, { desc }) => desc(createdAt),
			limit,
			offset,
			with: {
				articlesToTags: {
					columns: {},
					with: {
						tag: true
					}
				},
				author: {
					columns: { username: true }
				},
				likes: {
					columns: { articleId: true }
				}
			}
		})
);

/**
 * Cached database call to get the total number of articles.
 *
 * @param db instance of the DB
 */
export const getTotalArticlesCountQuery = cache(async (db: DB) => {
	const res = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(article);

	// Really should not happen
	if (!res[0]) throw new Error("Something went wrong getting total article count");

	return res[0].count;
});

/**
 * Cached database call to get a specific article by ID with author and tag info.
 *
 * @param db instance of the DB
 * @param articleId id of the article to get
 */
export const getArticleByIdQuery = cache(
	async (db: DB, articleId: string) =>
		await db.query.article.findFirst({
			where: ({ id }, { eq }) => eq(id, articleId),
			with: {
				articlesToTags: {
					columns: {},
					with: {
						tag: true
					}
				},
				author: {
					columns: { username: true }
				},
				likes: true
			}
		})
);

/**
 * Cached database call to get articles created by a specific author, with tag info.
 *
 * @param db instance of the DB
 * @param id id of the author
 * @param limit how many items to get
 * @param offset how many items to offset
 */
export const getArticlesByAuthorIdQuery = cache(
	async (db: DB, id: string, limit: number, offset: number) =>
		await db.query.article.findMany({
			columns: { body: false },
			where: ({ authorId }, { eq }) => eq(authorId, id),
			orderBy: ({ createdAt }, { desc }) => desc(createdAt),
			limit,
			offset,
			with: {
				articlesToTags: {
					columns: {},
					with: {
						tag: true
					}
				},
				likes: {
					columns: {
						articleId: true
					}
				}
			}
		})
);

/**
 * Cached database call to get tags by their text.
 *
 * @param db instance of the DB
 * @param tags string array of tag texts to find
 */
export const getTagsByTextQuery = cache(
	async (db: DB, tags: string[]) =>
		await db.query.tag.findMany({
			where: ({ text }, { inArray }) => inArray(text, tags)
		})
);

/** Mutations */

/**
 * Query to add tags to the database. Will only add if the array is not empty.
 *
 * @param db instance of the DB
 * @param tags to be added
 * @returns true if added; false if no tags added
 */
export const insertTagsMutation = async (db: DB, tags: TagInsert[]) => {
	// Don't bother if the array is empty
	if (tags.length === 0) return false;

	// On conflict does nothing to ensure any tags that already exist are not added again
	await db.insert(tag).values(tags).onConflictDoNothing();

	return true;
};

/**
 * Query to add tag connections to an article. Will only add if tagIds is not empty.
 *
 * @param db instance of the DB
 * @param tagIds IDs of the tags to be added
 * @param articleId ID of the article to add them to
 * @returns true if added; false if not
 */
export const connectTagsToArticleMutation = async (db: DB, tagIds: string[], articleId: string) => {
	// Don't bother if the array is empty
	if (tagIds.length === 0) return false;

	// Generate the connections needed and add to DB
	const articleTagConnections = tagIds.map((id) => ({
		tagId: id,
		articleId
	}));

	// On conflict does nothing as tag connections might already exist
	await db.insert(articlesToTags).values(articleTagConnections).onConflictDoNothing();

	return true;
};
