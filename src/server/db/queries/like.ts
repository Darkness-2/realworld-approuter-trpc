import { type DB } from "$/server/db";
import { like, type Like, type LikeInsert } from "$/server/db/schema/like";
import { and, eq } from "drizzle-orm";
import { cache } from "react";

/** Queries */

/**
 * Cached database call to get the liked articles of a specific user.
 *
 * @param db instance of the DB
 * @param userId id of the user
 * @returns array of likes
 */
export const getLikedArticlesQuery = cache(
	async (db: DB, userId: string) =>
		await db.query.like.findMany({
			columns: { articleId: true },
			where: ({ userId: uid }, { eq }) => eq(uid, userId)
		})
);

/** Mutations */

/**
 * Adds a new like into the database.
 * @param db instance of the DB
 * @param likeToInsert like to insert
 */
export const likeArticleMutation = async (db: DB, likeToInsert: LikeInsert) => {
	await db
		.insert(like)
		.values(likeToInsert)
		// Do nothing as like might already exist
		.onConflictDoNothing();
};

/**
 * Deletes a like from the database.
 * @param db instance of the DB
 * @param likeToDelete like to delete
 */
export const unlikeArticleMutation = async (db: DB, likeToDelete: Like) => {
	await db.delete(like).where(and(eq(like.articleId, likeToDelete.articleId), eq(like.userId, likeToDelete.userId)));
};
