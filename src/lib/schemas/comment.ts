import { articleIdSchema } from "$/lib/schemas/article";
import { z } from "zod";

/**
 * Field schemas
 */
export const commentIdSchema = z.string({
	invalid_type_error: "Comment ID must be a string",
	required_error: "Comment ID is required"
});

const bodySchema = z
	.string({
		invalid_type_error: "Body must be a string",
		required_error: "Body is required"
	})
	.min(1, "Body must be at least 1 character");

/**
 * Full schemas
 */
export const createCommentSchema = z.object({
	articleId: articleIdSchema,
	body: bodySchema
});
