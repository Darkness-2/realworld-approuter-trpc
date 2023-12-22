"use client";

import { trpc } from "$/lib/trpc/client";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { Text } from "@chakra-ui/react";

type ExpensiveMessageClientProps = {
	initialData: RouterOutputs["example"]["getExpensiveMessage"];
};

export default function ExpensiveMessageClient({ initialData }: ExpensiveMessageClientProps) {
	const expensiveMessage = trpc.example.getExpensiveMessage.useQuery(undefined, {
		initialData,
		trpc: {
			context: {
				skipBatch: true
			}
		}
	});

	return <Text>Expensive message: {expensiveMessage.data}</Text>;
}
