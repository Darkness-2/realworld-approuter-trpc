import { z } from "zod";

export const offsetLimitSchema = z.object({
	offset: z.number().min(0).default(0),
	limit: z.number().min(1).max(100).default(10)
});
