import { type DB } from "$/server/db";
import { article } from "$/server/db/schema/article";
import { sql } from "drizzle-orm";
import { cache } from "react";

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
export const globalFeedQuery = cache(
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
				}
			}
		})
);

/**
 * Cached database call to get the total number of articles.
 *
 * @param db instance of the DB
 */
export const countTotalArticles = cache(async (db: DB) => {
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
export const articleByIdQuery = cache(
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
				}
			}
		})
);

export const articlesByAuthorId = cache(
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
				}
			}
		})
);
