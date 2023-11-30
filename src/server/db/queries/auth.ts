import { type DB } from "$/server/db";
import { cache } from "react";

/**
 * Cached query to get a user based on their username.
 *
 * @param db instance of the DB
 * @param name username of the user to find
 * @returns the user or undefined if not found
 */
export const userByUsernameQuery = cache(
	async (db: DB, name: string) =>
		await db.query.user.findFirst({
			where: ({ username }, { eq }) => eq(username, name)
		})
);
