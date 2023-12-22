import { z } from "zod";

export const messageNameSchema = z
	.string({
		invalid_type_error: "Name must be a string",
		required_error: "Name is required"
	})
	.min(1, "Name must be at least one character");
