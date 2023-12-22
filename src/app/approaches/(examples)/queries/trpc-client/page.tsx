"use client";

import ApproachPageTemplate from "$/app/approaches/ApproachPageTemplate";
import { trpc } from "$/lib/trpc/client";
import { Text } from "@chakra-ui/react";

// Note this whole page is marked as use client
export default function TRPCClientPage() {
	// Using react query to get data client-side
	const basicMessage = trpc.example.getBasicMessage.useQuery(undefined);
	const expensiveMessage = trpc.example.getExpensiveMessage.useQuery(undefined, {
		trpc: {
			context: {
				skipBatch: true
			}
		}
	});

	return (
		<ApproachPageTemplate heading="Loading data via tRPC, client-side" displayButtons pros={[""]} cons={[""]}>
			{/* Wrapped in a check for the status as it could be loading */}
			{basicMessage.status === "loading" && <Text>Loading basic message...</Text>}
			{basicMessage.status === "success" && <Text>Basic message: {basicMessage.data}</Text>}

			{/* Same - wrapped in a check for the status as it could be loading */}
			{expensiveMessage.status === "loading" && <Text>Loading expensive message...</Text>}
			{expensiveMessage.status === "success" && <Text>Expensive message: {expensiveMessage.data}</Text>}
		</ApproachPageTemplate>
	);
}
