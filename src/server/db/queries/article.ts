import { ArticleError } from "$/lib/utils/errors";
import { countStar, generateFutureDate } from "$/lib/utils/helpers";
import { type DB } from "$/server/db";
import { getAuthorsFollowingQuery } from "$/server/db/queries/follow";
import { getLikedArticlesListQuery } from "$/server/db/queries/like";
import {
	article,
	articleToTag,
	tag,
	type Article,
	type ArticleInsert,
	type TagInsert
} from "$/server/db/schema/article";
import { and, eq, inArray } from "drizzle-orm";
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
 * @returns articles with tag, author, and likes info
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
	const res = await db.select({ count: countStar }).from(article);

	// Really should not happen
	if (!res[0]) throw new Error("Something went wrong getting total article count");

	return res[0].count;
});

/**
 * Cached database call to get the data requried for the user's custom feed.
 * Sorted descending by createdAt date.
 *
 * @param db instance of the db
 * @param userId id of the user to get the feed for
 * @param limit how many items to get
 * @param offset how many items to offset
 * @returns articles with tag, author, and likes info
 */
export const getUserFeedQuery = cache(async (db: DB, userId: string, limit: number, offset: number) => {
	// Find the authors the user is following
	const authorsFollowing = await getAuthorsFollowingQuery(db, userId);
	const authorIds = authorsFollowing.map((a) => a.authorId);

	return await db.query.article.findMany({
		columns: { body: false },
		where: ({ authorId }, { inArray }) => inArray(authorId, authorIds),
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
	});
});

export const getUserFeedArticlesCountQuery = cache(async (db: DB, userId: string) => {
	// Find the authors the user is following
	const authorsFollowing = await getAuthorsFollowingQuery(db, userId);
	const authorIds = authorsFollowing.map((a) => a.authorId);

	const res = await db.select({ count: countStar }).from(article).where(inArray(article.authorId, authorIds));

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
 * @param cursor createdAt timestamp to get articles older than
 */
export const getArticlesByAuthorIdQuery = cache(async (db: DB, id: string, limit: number, cursor?: Date) => {
	// If date is undefined, generate a random date far into the future
	const date = cursor ?? generateFutureDate();

	return await db.query.article.findMany({
		columns: { body: false },
		where: ({ authorId, createdAt }, { eq, and, lt }) => and(eq(authorId, id), lt(createdAt, date)),
		orderBy: ({ createdAt }, { desc }) => desc(createdAt),
		limit,
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
	});
});

/**
 * Cached database call to get the articles a user likes, with tag info.
 *
 * @param db instance of the db
 * @param userId id of the user whose likes to get
 * @param limit how many items to get
 * @param cursor createdAt timestamp to get articles older than
 */
export const getLikedArticlesQuery = cache(async (db: DB, userId: string, limit?: number, cursor?: Date) => {
	const likedArticles = await getLikedArticlesListQuery(db, userId);

	const articleIds = likedArticles.map((like) => like.articleId);

	// Return early if no liked articles
	if (articleIds.length === 0) return [];

	// If date is undefined, generate a random date far into the future
	const date = cursor ?? generateFutureDate();

	return await db.query.article.findMany({
		columns: { body: false },
		where: ({ id, createdAt }, { lt, and, inArray }) => and(lt(createdAt, date), inArray(id, articleIds)),
		orderBy: ({ createdAt }, { desc }) => desc(createdAt),
		limit,
		// Todo: Extract the standard pieces of this (with, columns) into a helper type
		with: {
			author: {
				columns: { username: true }
			},
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
	});
});

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
	await db.insert(articleToTag).values(articleTagConnections).onConflictDoNothing();

	return true;
};

/**
 * Mutation to add an article along with any required tags.
 *
 * @param db instance of the db
 * @param newArticle article to insert
 * @param tagsToInsert tags to attach to the article
 * @returns id of the new article
 */
export const createArticleMutation = async (db: DB, newArticle: ArticleInsert, tagsToInsert: TagInsert[]) =>
	await db.transaction(async (tx) => {
		// Create article and tags
		const newArticleQuery = db.insert(article).values(newArticle).returning({ id: article.id });
		const newTagsQuery = insertTagsMutation(tx, tagsToInsert);

		// Run queries
		const [newArticles] = await Promise.all([newArticleQuery, newTagsQuery]);

		// Throw error if it didn't return the new article for some reason
		const articleId = newArticles[0]?.id;

		if (!articleId) {
			throw new ArticleError("ARTICLE_FAILED_TO_RETURN");
		}

		// Return early if no need to insert tags
		if (tagsToInsert.length === 0) return articleId;

		const tags = await getTagsByTextQuery(
			tx,
			tagsToInsert.map((tag) => tag.text)
		);
		const tagIds = tags.map((tag) => tag.id);

		await connectTagsToArticleMutation(tx, tagIds, articleId);

		return articleId;
	});

/**
 * Mutation to edit an article.
 *
 * @param db instance of the db
 * @param editedArticle values of the article to change
 * @param articleId id of the article being changed
 * @param tagsToInsert tags to attach to the article
 * @returns void
 */
export const editArticleMutation = async (
	db: DB,
	editedArticle: Partial<Article>,
	articleId: string,
	tagsToInsert: TagInsert[]
) =>
	await db.transaction(async (tx) => {
		// Edit article and create tags
		const editArticleQuery = tx.update(article).set(editedArticle).where(eq(article.id, articleId));
		const newTagsQuery = insertTagsMutation(tx, tagsToInsert);

		// Remove all existing tags from the article; will reset them later
		const removeTagsQuery = tx.delete(articleToTag).where(eq(articleToTag.articleId, articleId));

		// Run queries
		await Promise.all([editArticleQuery, newTagsQuery, removeTagsQuery]);

		// Return early if no need to insert tags
		if (tagsToInsert.length === 0) return;

		const tags = await getTagsByTextQuery(
			tx,
			tagsToInsert.map((tag) => tag.text)
		);
		const tagIds = tags.map((tag) => tag.id);

		await connectTagsToArticleMutation(tx, tagIds, articleId);
	});

/**
 * Mutation to delete an article.
 *
 * @param db instance of the DB
 * @param articleId id of the article to delete
 * @param authorId userId to confirm ownership
 * @returns array of deleted articles
 */
export const deleteArticleMutation = async (db: DB, articleId: string, authorId: string) =>
	await db
		.delete(article)
		.where(and(eq(article.id, articleId), eq(article.authorId, authorId)))
		.returning();
