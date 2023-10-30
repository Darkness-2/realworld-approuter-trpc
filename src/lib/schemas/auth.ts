import { z } from "zod";

const usernameCreateSchema = z.string();
const usernameLoginSchema = z.string().min(1).max(31);

const passwordCreateSchema = z.string();
const passwordLoginSchema = z.string().min(1).max(255);

export const createUserSchema = z.object({
	username: usernameCreateSchema,
	password: passwordCreateSchema
});

export const loginUserSchema = z.object({
	username: usernameLoginSchema,
	password: passwordLoginSchema
});
