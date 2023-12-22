"use server";

import { type messageNameSchema } from "$/lib/schemas/example";
import { getServerTRPCCaller } from "$/lib/trpc/serverClient";
import { TRPCError } from "@trpc/server";
import { ZodError, type typeToFlattenedError } from "zod";

type ReturnData = {
	data?: string;
	errors?: typeToFlattenedError<typeof messageNameSchema>;
};

export const getPersonalizedMessage = async (_: unknown, formData: FormData): Promise<ReturnData> => {
	const caller = getServerTRPCCaller();

	try {
		const message = await caller.example.generatePersonalizedMessage(formData.get("name") as string);

		return { data: message };
	} catch (e) {
		if (e instanceof TRPCError) {
			if (e.cause instanceof ZodError) {
				return { errors: e.cause.flatten() };
			}
		}
		return { errors: { formErrors: ["Something went wrong"], fieldErrors: {} } };
	}
};
