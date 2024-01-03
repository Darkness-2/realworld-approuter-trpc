"use server";

// Todo: Review Next.js CSRF protection docs

import { type messageNameSchema } from "$/lib/schemas/example";
import { formatTRPCError, type FormattedTRPCErrors } from "$/lib/trpc/errors";
import { getServerTRPCCaller } from "$/lib/trpc/serverClient";
import { type RouterInputs, type RouterOutputs } from "$/lib/trpc/shared";

type Input = RouterInputs["example"]["generatePersonalizedMessage"];

type ActionState =
	| {
			state: "success";
			message: RouterOutputs["example"]["generatePersonalizedMessage"];
	  }
	| {
			state: "error";
			errors: FormattedTRPCErrors<typeof messageNameSchema>;
	  };

// Todo: Convert this into generic wrapper function
export const getPersonalizedMessage = async (input: Input): Promise<ActionState> => {
	const caller = getServerTRPCCaller();

	try {
		const message = await caller.example.generatePersonalizedMessage(input);
		return { state: "success", message };
	} catch (e) {
		return { state: "error", errors: formatTRPCError(e) };
	}
};
