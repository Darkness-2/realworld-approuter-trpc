import { type TagInsert } from "$/server/db/schema/article";

/**
 * Helper type for Next.js search params
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional
 */
export type SearchParams = { [key: string]: string | string[] | undefined };

/**
 * Helper format to convert a string array into the tag format the DB expects
 * @param tags string array of tags to insert or undefined
 * @returns array of tags (can be length 0 if tags was undefined)
 */
export const convertTagsToDBFormat = (tags: string[] | undefined): TagInsert[] => {
	return tags?.map((tag) => ({ text: tag })) ?? [];
};

/**
 * Standard date formatter to be used for date strings.
 */
export const dateFormatter = new Intl.DateTimeFormat("en-CA", {
	dateStyle: "long"
});
