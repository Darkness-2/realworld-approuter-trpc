import { type TagInsert } from "$/server/db/schema/article";
import { sql } from "drizzle-orm";

// Todo: Organize helpers
// Maybe by server and other?

/**
 * Helper type for Next.js search params
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional
 */
export type SearchParams = { [key: string]: string | string[] | undefined };

/**
 * Helper to convert a searchParam into an int.
 * @param param param to convert
 * @returns converted integer or 1 if param is un-parseable
 */
export const convertSearchParamToInt = (param: SearchParams[string]) => {
	return typeof param === "string" ? parseInt(param) : 1;
};

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

/**
 * Helper function to find the last page number of a given set of paginated items.
 * @param total number of items being paginated
 * @param pageSize number of items per page
 * @returns number of the last page
 */
export const findLastPageNumber = (total: number, pageSize: number) => {
	return Math.ceil(total / pageSize);
};

/**
 * Helper function to get the limit and offset values for a particular page number.
 * @param pageNumber page number to get the values for
 * @param pageSize size of a page
 * @returns object including limit and offset values
 */
export const getLimitOffsetForPage = (pageNumber: number, pageSize: number) => {
	return {
		limit: pageSize,
		offset: (pageNumber - 1) * pageSize
	};
};

/**
 * Helper function to generate a date far into the future.
 * @returns date 10 years in the future
 */
export const generateFutureDate = () => {
	const date = new Date();
	date.setFullYear(date.getFullYear() + 10);

	return date;
};

/**
 * Helper sql string that gets the count of a SQL query as a number.
 */
export const countStar = sql<number>`cast(count(*) as int)`;

/**
 * Helper function to delay execution for a period of time.
 * @param time in ms
 * @returns void
 */
export const delay = (time: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, time));
};
