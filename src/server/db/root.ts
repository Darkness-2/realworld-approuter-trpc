import { pgTableCreator } from "drizzle-orm/pg-core";
import { env } from "../../env.mjs";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM.
 * Allows for use of the same database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const pgTable = pgTableCreator((name) => `${env.TABLE_PREFIX}_${name}`);
