import { ArticleError, AuthError, CommentError } from "$/lib/utils/errors";
import { TRPCError } from "@trpc/server";
import { ZodError, type ZodType, type inferFlattenedErrors } from "zod";

/**
 * Helper function to format an unknown error into better format.
 *
 * @param error unknown error type
 * @template ZodSchema types the resulting ZodError for a given schema
 * @returns an object with underlying helpful error types
 */
export const formatTRPCError = <ZodSchema extends ZodType>(error: unknown) => {
	// If error is not a TRPCError, return empty object
	if (!(error instanceof TRPCError))
		return {
			zodError: null,
			authError: null,
			articleError: null,
			commentError: null
		};

	return {
		// Provide specific type for zodError if generic is given
		zodError: error.cause instanceof ZodError ? (error.cause.flatten() as inferFlattenedErrors<ZodSchema>) : null,
		authError: error.cause instanceof AuthError ? error.cause.code : null,
		articleError: error.cause instanceof ArticleError ? error.cause.code : null,
		commentError: error.cause instanceof CommentError ? error.cause.code : null
	};
};

/**
 * Helper type for formatted TRPC errors.
 * @template ZodSchema types the resulting ZodError for a given schema
 */
export type FormattedTRPCErrors<ZodSchema extends ZodType = ZodType> = ReturnType<typeof formatTRPCError<ZodSchema>>;
