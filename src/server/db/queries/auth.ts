import { type DB } from "$/server/db";
import { cache } from "react";

export const userByUsernameQuery = cache(
	async (db: DB, name: string) =>
		await db.query.user.findFirst({
			where: ({ username }, { eq }) => eq(username, name)
		})
);
