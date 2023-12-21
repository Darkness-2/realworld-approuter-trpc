import { delay } from "$/lib/utils/helpers";
import { cache } from "react";

const generateMessage = (name?: string) => {
	if (name) return `Hello ${name} from the server! Generated at: ${new Date().toISOString()}`;
	return `Hello from the server! Generated at: ${new Date().toISOString()}`;
};

export const generateBasicMessage = cache(async () => {
	// Simulate quick database call
	await delay(100);
	return generateMessage();
});

export const generateExpensiveMessage = cache(async () => {
	// Simulate slow database call
	await delay(3000);
	return generateMessage();
});

export const generatePersonalizedMessage = async (name: string) => {
	// Simulate database mutation
	await delay(250);
	return generateMessage(name);
};
