import { userIdSchema } from "$/lib/schemas/auth";
import { z } from "zod";

/**
 * Field schemas
 */
const toggleFollowActions = ["follow", "unfollow"] as const;
const toggleActionSchema = z.enum(toggleFollowActions, {
	invalid_type_error: "Action is not the right type",
	required_error: "Action is required"
});

/**
 * Full schemas
 */
export const toggleFollowSchema = z.object({
	authorId: userIdSchema,
	action: toggleActionSchema
});
