import { formatTRPCError, type FormattedTRPCErrors } from "$/lib/trpc/errors";
import { getServerTRPCCaller } from "$/lib/trpc/serverClient";
import { type ZodType } from "zod";

// Need to disable this to ensure the callback function is something callable
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericFunction = (...any: any[]) => any;

// Type definition for the callback function; expects you to return a procedure
type CallbackFunction<Procedure extends GenericFunction> = (
	caller: ReturnType<typeof getServerTRPCCaller>
) => Procedure;

// Type helpers for getting the inputs and outputs of the procedure
type ProcedureInput<Procedure extends GenericFunction> = Parameters<Procedure>;

type ProcedureOutput<Procedure extends GenericFunction> = Awaited<ReturnType<Procedure>>;

// Type definition for standard action output
type ActionState<Output, Schema extends ZodType> =
	| {
			status: "success";
			data: Output;
	  }
	| {
			status: "error";
			errors: FormattedTRPCErrors<Schema>;
	  };

/**
 * Factory to create tRPC server actions with consistent output.
 * @param callback function that expects you to return the procedure we want to run in this server action
 * @template Procedure the tRPC procedure you want to run in this server action; should be automatically inferred
 * @template Schema Zod schema for the procedure which provides better typing of any resultant Zod errors
 * @returns a function that runs the selected procedure and returns with a standard format
 */
export const createServerAction = <Procedure extends GenericFunction, Schema extends ZodType>(
	callback: CallbackFunction<Procedure>
) => {
	// Construct the server action that accepts the input parameters of the procedure and returns the standard ActionState
	return async (...input: ProcedureInput<Procedure>): Promise<ActionState<ProcedureOutput<Procedure>, Schema>> => {
		const caller = getServerTRPCCaller();

		try {
			// Get the selected procedure from the callback
			const procedure = callback(caller);

			// Run it with the input and return data
			const data = await procedure(...input);
			return { status: "success", data };
		} catch (e) {
			// Or catch the error and return errors
			return { status: "error", errors: formatTRPCError<Schema>(e) };
		}
	};
};
