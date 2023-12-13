import { generateFutureDate } from "$/lib/utils/helpers";
import { type DB } from "$/server/db";
import { comment, type CommentInsert } from "$/server/db/schema/comment";
import { and, eq } from "drizzle-orm";
import { cache } from "react";

/** Queries */

/**
 * Cached database call to get an article's comments.
 * Includes comment author username.
 *
 * @param db instance of the DB
 * @param articleId id of the article
 * @param limit how many items to get
 * @param cursor createdAt timestamp to get comments older than
 * @returns array of comments for the article
 */
export const getArticleCommentsQuery = cache(async (db: DB, articleId: string, limit: number, cursor?: Date) => {
	// If date is undefined, generate a random date far into the future
	const date = cursor ?? generateFutureDate();

	return await db.query.comment.findMany({
		where: ({ articleId: aid, createdAt }, { and, eq, lt }) => and(eq(aid, articleId), lt(createdAt, date)),
		orderBy: ({ createdAt }, { desc }) => desc(createdAt),
		limit,
		with: {
			author: { columns: { username: true } }
		}
	});
});

/** Mutations */

/**
 *	Mutation to create a new comment.
 *
 * @param db instance of the db
 * @param newComment
 * @returns array of new comments
 */
export const createCommentMutation = async (db: DB, newComment: CommentInsert) =>
	await db.insert(comment).values(newComment).returning();

/**
 * Mutation to delete a comment.
 *
 * @param db instance of the DB
 * @param commentId id of the comment to delete
 * @param authorId userId to confirm ownership of the comment
 * @returns an array of comments that were deleted
 */
export const deleteCommentMutation = async (db: DB, commentId: string, authorId: string) =>
	await db
		.delete(comment)
		.where(and(eq(comment.id, commentId), eq(comment.authorId, authorId)))
		.returning();
