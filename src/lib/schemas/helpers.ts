import { z } from "zod";

/**
 * Schema for standard limit-offset pagination.
 */
export const limitOffsetSchema = z.object({
	limit: z.number().min(1).max(100).default(10),
	offset: z.number().min(0).default(0)
});

/**
 * Schema for cursor pagination, using createdAt timestamps.
 */
export const limitCreatedAtCursorSchema = z.object({
	limit: z.number().min(1).max(100).default(10),
	cursor: z.date().optional()
});
