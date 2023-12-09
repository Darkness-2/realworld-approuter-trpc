import { articleIdSchema } from "$/lib/schemas/article";
import { z } from "zod";

/**
 * Field schemas
 */
const toggleLikeActions = ["like", "unlike"] as const;
const toggleActionSchema = z.enum(toggleLikeActions, {
	invalid_type_error: "Action is not the right type",
	required_error: "Action is required"
});

/**
 * Full schemas
 */
export const toggleLikeSchema = z.object({
	articleId: articleIdSchema,
	action: toggleActionSchema
});
