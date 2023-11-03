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

export const articleErrorCodes = ["ARTICLE_FAILED_TO_CREATE"] as const;

export type ArticleErrorCodes = (typeof articleErrorCodes)[number];

/**
 * Custom error class for article-related errors.
 * Should be added as the cause of tRPC errors.
 */
export class ArticleError extends Error {
	code: ArticleErrorCodes;

	constructor(code: ArticleErrorCodes) {
		super(code);
		this.code = code;
	}
}
