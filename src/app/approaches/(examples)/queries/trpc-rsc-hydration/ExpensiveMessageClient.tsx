"use client";

import { trpc } from "$/lib/trpc/client";
import { Text } from "@chakra-ui/react";

export default function ExpensiveMessageClient() {
	const expensiveMessage = trpc.example.getExpensiveMessage.useQuery(undefined, {
		trpc: {
			context: {
				skipBatch: true
			}
		}
	});

	return (
		<>
			{/* Wrapped in a check for status, even though hydration should ensure it is always loaded */}
			{expensiveMessage.status === "loading" && <Text>Loading expensive message...</Text>}
			{expensiveMessage.status === "success" && <Text>Expensive message: {expensiveMessage.data}</Text>}
		</>
	);
}
