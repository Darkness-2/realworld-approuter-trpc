import { type AppRouter } from "$/server/trpc/root";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

/**
 * Helper function to generate the base URL for the server
 * @returns base URL to use for requests to the server
 */
const getBaseUrl = () => {
	// If in the browser, use the relative path
	if (typeof window !== "undefined") return "";
	// If server-side on Vercel, use the Vercel URL
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	// Assume all other cases are during local development
	return `http://localhost:${process.env.PORT ?? 3000}`;
};

/**
 * Helper function to generate the URL for tRPC requests
 * @returns URL to use for requests to tRPC
 */
export const getTRPCUrl = () => {
	return getBaseUrl() + "/api/trpc";
};

/**
 * Inference helper for inputs.
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
