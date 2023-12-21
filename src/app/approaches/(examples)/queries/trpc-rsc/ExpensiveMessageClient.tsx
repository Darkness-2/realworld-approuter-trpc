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
			{expensiveMessage.status === "loading" && <Text>Loading expensive message via tRPC client-side...</Text>}
			{expensiveMessage.status === "success" && (
				<Text>Expensive message via tRPC client-side: {expensiveMessage.data}</Text>
			)}
		</>
	);
}
