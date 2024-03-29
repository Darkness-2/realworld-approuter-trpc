import BasicMessageClient from "$/app/approaches/(examples)/queries/trpc-rsc-hydration/BasicMessageClient";
import ExpensiveMessageClient from "$/app/approaches/(examples)/queries/trpc-rsc-hydration/ExpensiveMessageClient";
import ApproachPageTemplate from "$/app/approaches/ApproachPageTemplate";
import TRPCHydrate from "$/lib/trpc/TRPCHydrate";
import { getServerTRPCClient } from "$/lib/trpc/serverClient";
import { Text } from "@chakra-ui/react";
import { Suspense } from "react";

export default async function TRPCRSCHydrationPage() {
	// Data fetching is still server-side but through tRPC
	// No need to pass result as it is automatically done via hydration
	await getServerTRPCClient().example.getBasicMessage.prefetch();

	return (
		<ApproachPageTemplate
			heading="Loading data via tRPC in a React server component (RSC), hydrating via React Query's <Hydrate /> component"
			displayButtons
			pros={[""]}
			cons={[""]}
		>
			<TRPCHydrate>
				<BasicMessageClient />
			</TRPCHydrate>

			<Suspense fallback={<Text>Loading expensive message...</Text>}>
				<ExpensiveMessageServer />
			</Suspense>
		</ApproachPageTemplate>
	);
}

// Separating out slow data fetching so we can surround it with suspense
async function ExpensiveMessageServer() {
	await getServerTRPCClient().example.getExpensiveMessage.prefetch();

	return (
		<TRPCHydrate>
			<ExpensiveMessageClient />
		</TRPCHydrate>
	);
}
