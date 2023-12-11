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
