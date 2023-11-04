import { type DB } from "$/server/db";
import { article } from "$/server/db/schema/article";
import { desc } from "drizzle-orm";
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
			orderBy: desc(article.createdAt),
			limit: limit,
			offset: offset,
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
