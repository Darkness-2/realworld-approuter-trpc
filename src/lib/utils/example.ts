import { delay } from "$/lib/utils/helpers";
import { cache } from "react";

const generateMessage = (name?: string) => {
	if (name) return `Hello ${name} from the server! Generated at: ${new Date().toISOString()}`;
	return `Hello from the server! Generated at: ${new Date().toISOString()}`;
};

export const generateBasicMessage = cache(async () => {
	await delay(1);
	return generateMessage();
});

export const generateExpensiveMessage = cache(async () => {
	await delay(3000);
	return generateMessage();
});

export const generatePersonalizedMessage = async (name: string) => {
	await delay(100);
	return generateMessage(name);
};
