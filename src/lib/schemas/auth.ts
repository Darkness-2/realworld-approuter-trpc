import { z } from "zod";

const usernameCreateSchema = z.string().min(4).max(31);
const usernameLoginSchema = z.string().min(1).max(31);

const passwordCreateSchema = z.string().min(6).max(255);
const passwordLoginSchema = z.string().min(1).max(255);

export const createUserSchema = z.object({
	username: usernameCreateSchema,
	password: passwordCreateSchema
});

export const loginUserSchema = z.object({
	username: usernameLoginSchema,
	password: passwordLoginSchema
});
