import ApproachPageTemplate from "$/app/approaches/ApproachPageTemplate";
import { getServerTRPCClient } from "$/lib/trpc/serverClient";
import { Text } from "@chakra-ui/react";
import { Suspense } from "react";

export default async function TRPCRSCPage() {
	// Data fetching is still server-side, but through tRPC
	const message = await getServerTRPCClient().example.getBasicMessage.fetch();

	return (
		<ApproachPageTemplate
			heading="Loading data via tRPC in a React server component (RSC)"
			displayButtons
			pros={[""]}
			cons={[""]}
		>
			<Text>Basic message: {message}</Text>

			{/* Wrapped in suspense as it takes longer to load */}
			<Suspense fallback={<Text>Loading expensive message via suspense...</Text>}>
				<ExpensiveMessage />
			</Suspense>
		</ApproachPageTemplate>
	);
}

// Separating out slow data fetching so we can surround it with suspense
async function ExpensiveMessage() {
	const message = await getServerTRPCClient().example.getExpensiveMessage.fetch();

	return <Text>Expensive message from suspense: {message}</Text>;
}
