"use server";

// Todo: Review Next.js CSRF protection docs

import { createServerAction } from "$/lib/trpc/actions";

export const generatePersonalizedMessageAction = createServerAction((t) => t.example.generatePersonalizedMessage);
