"use client";

import { trpc } from "$/lib/trpc/client";
import { Text } from "@chakra-ui/react";

// Separate component as this one has to be marked use client
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
			{expensiveMessage.status === "loading" && <Text>Loading expensive message via tRPC client-side...</Text>}
			{expensiveMessage.status === "success" && (
				<Text>Expensive message via tRPC client-side: {expensiveMessage.data}</Text>
			)}
		</>
	);
}
