import { z } from "zod";

/**
 * Error messages
 *
 * Todo: Consider translation file for this and all other text?
 */
const usernameErrorMessages = {
	required_error: "Username is required",
	invalid_type_error: "Username must be a string"
};
const usernameCreateTooShortMessage = "Username must be 4 characters or more";
const usernameLoginTooShortMessage = "Username must be 1 characters or more";
const usernameTooLongMessage = "Username must be 31 characters or less";

const passwordErrorMessages = {
	required_error: "Password is required",
	invalid_type_error: "Password must be a string"
};
const passwordCreateTooShortMessage = "Password must be 6 characters or more";
const passwordLoginTooShortMessage = "Password must be 1 characters or more";
const passwordTooLongMessage = "Password must be 255 characters or less";

/**
 * Field schemas
 */
export const userIdSchema = z.string({
	invalid_type_error: "User ID must be a string",
	required_error: "User ID is required"
});

export const usernameCreateSchema = z
	.string(usernameErrorMessages)
	.min(4, usernameCreateTooShortMessage)
	.max(31, usernameTooLongMessage);
const usernameLoginSchema = z
	.string(usernameErrorMessages)
	.min(1, usernameLoginTooShortMessage)
	.max(31, usernameTooLongMessage);

const passwordCreateSchema = z
	.string(passwordErrorMessages)
	.min(6, passwordCreateTooShortMessage)
	.max(255, passwordTooLongMessage);
const passwordLoginSchema = z
	.string(passwordErrorMessages)
	.min(1, passwordLoginTooShortMessage)
	.max(255, passwordTooLongMessage);

/**
 * Full schemas
 */
export const createUserSchema = z
	.object({
		username: usernameCreateSchema,
		password: passwordCreateSchema,
		confirmPassword: passwordCreateSchema
	})
	.refine((v) => v.password === v.confirmPassword, {
		message: "Passwords must match",
		path: ["confirmPassword"]
	});

export const loginUserSchema = z.object({
	username: usernameLoginSchema,
	password: passwordLoginSchema
});

export const updatePasswordSchema = z
	.object({
		currentPassword: passwordLoginSchema,
		newPassword: passwordCreateSchema,
		confirmNewPassword: passwordCreateSchema
	})
	.refine((v) => v.newPassword === v.confirmNewPassword, {
		message: "Passwords must match",
		path: ["confirmNewPassword"]
	});
