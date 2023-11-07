import { z } from "zod";

/**
 * Field schemas
 */
export const articleIdSchema = z.string({
	invalid_type_error: "Article ID must be a string",
	required_error: "Article ID is required"
});

const titleSchema = z
	.string({
		invalid_type_error: "Title must be a string",
		required_error: "Title is required"
	})
	.min(3, "Title must be at least 3 characters")
	.max(128, "Title must be at 128 characters or less");

const descriptionSchema = z
	.string({
		invalid_type_error: "Description must be a string",
		required_error: "Description is required"
	})
	.min(3, "Description must be at least 3 characters")
	.max(256, "Description must be 256 characters or less");

const bodySchema = z
	.string({
		invalid_type_error: "Body must be a string",
		required_error: "Body is required"
	})
	.min(1, "Body must be at least 1 character");

const tagsSchema = z
	.string({
		invalid_type_error: "Tag must be a string",
		required_error: "Tag is required"
	})
	.min(1, "Tag must be at least 1 character")
	.max(32, "Tag must be 32 characters or less")
	.array()
	.optional();

export const articleAuthorUsernameSchema = z
	.string({
		invalid_type_error: "Username must be a string",
		required_error: "Username is required"
	})
	.min(1, "Username must be at least 1 character");

/**
 * Full schemas
 */
export const createArticleSchema = z.object({
	title: titleSchema,
	description: descriptionSchema,
	body: bodySchema,
	tags: tagsSchema
});
