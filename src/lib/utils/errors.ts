export const authErrorCodes = ["INVALID_USERNAME_OR_PASSWORD", "USER_IS_UNAUTHORIZED", "USERNAME_TAKEN"] as const;

export type AuthErrorCodes = (typeof authErrorCodes)[number];

/**
 * Custom error class for auth-related errors.
 * Should be added as the cause of tRPC errors.
 */
export class AuthError extends Error {
	code: AuthErrorCodes;

	constructor(code: AuthErrorCodes) {
		super(code);
		this.code = code;
	}
}
