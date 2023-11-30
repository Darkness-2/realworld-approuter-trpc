import { type DB } from "$/server/db";
import { follow, type Follow, type FollowInsert } from "$/server/db/schema/follow";
import { and, eq } from "drizzle-orm";
import { cache } from "react";

/** Queries */

/**
 * Cached database call to get the authors the user is following.
 *
 * @param db instance of the DB
 * @param userId id of the user
 * @returns array of authors following
 */
export const getAuthorsFollowingQuery = cache(
	async (db: DB, userId: string) =>
		await db.query.follow.findMany({
			columns: { authorId: true },
			where: ({ userId: uid }, { eq }) => eq(uid, userId)
		})
);

/** Mutations */

/**
 * Inserts a follow into the database.
 * @param db instance of the DB
 * @param followToInsert follow to insert
 */
export const insertFollow = async (db: DB, followToInsert: FollowInsert) => {
	await db
		.insert(follow)
		.values(followToInsert)
		// Do nothing as follow relationship might already exist
		.onConflictDoNothing();
};

/**
 * Deletes a follow from the database.
 * @param db instance of the DB
 * @param followToDelete follow to delete
 */
export const deleteFollow = async (db: DB, followToDelete: Follow) => {
	await db
		.delete(follow)
		.where(and(eq(follow.userId, followToDelete.userId), eq(follow.authorId, followToDelete.authorId)));
};
