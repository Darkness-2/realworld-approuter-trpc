"use server";

import { type messageNameSchema } from "$/lib/schemas/example";
import { formatTRPCError, type FormattedTRPCErrors } from "$/lib/trpc/errors";
import { getServerTRPCCaller } from "$/lib/trpc/serverClient";

type ActionState = {
	data?: string;
	errors?: FormattedTRPCErrors<typeof messageNameSchema>;
};

export const getPersonalizedMessage = async (_: ActionState, formData: FormData): Promise<ActionState> => {
	const caller = getServerTRPCCaller();

	try {
		const message = await caller.example.generatePersonalizedMessage(formData.get("name") as string);

		return { data: message };
	} catch (e) {
		return { errors: formatTRPCError<typeof messageNameSchema>(e) };
	}
};
