"use server";

// Todo: Review Next.js CSRF protection docs

import { createServerAction } from "$/lib/trpc/actions";

export const generatePersonalizedMessage = createServerAction((c) => c.example.generatePersonalizedMessage);
