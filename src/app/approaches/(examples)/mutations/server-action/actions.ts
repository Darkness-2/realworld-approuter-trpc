"use server";

import { messageNameSchema } from "$/lib/schemas/example";
import { generatePersonalizedMessage } from "$/lib/utils/example";
import { type typeToFlattenedError } from "zod";

type ReturnData = {
	data?: string;
	errors?: typeToFlattenedError<typeof messageNameSchema>;
};

export const getPersonalizedMessage = async (_: unknown, formData: FormData): Promise<ReturnData> => {
	// Validate input
	const input = messageNameSchema.safeParse(formData.get("name"));

	if (!input.success) return { errors: input.error.flatten() };

	// Generate message
	const message = await generatePersonalizedMessage(input.data);

	return { data: message };
};
