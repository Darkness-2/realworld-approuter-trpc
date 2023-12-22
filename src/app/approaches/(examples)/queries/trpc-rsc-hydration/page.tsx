import BasicMessageClient from "$/app/approaches/(examples)/queries/trpc-rsc-hydration/BasicMessageClient";
import ExpensiveMessageClient from "$/app/approaches/(examples)/queries/trpc-rsc-hydration/ExpensiveMessageClient";
import ApproachPageTemplate from "$/app/approaches/ApproachPageTemplate";
import TRPCHydrate from "$/lib/trpc/TRPCHydrate";
import { getServerTRPCClient } from "$/lib/trpc/serverClient";
import { Text } from "@chakra-ui/react";
import { Suspense } from "react";

const getBasicData = async () => {
	return await getServerTRPCClient().example.getBasicMessage.prefetch();
};

const getExpensiveData = async () => {
	return await getServerTRPCClient().example.getExpensiveMessage.prefetch();
};

export default async function TRPCRSCHydrationPage() {
	const serverClient = getServerTRPCClient();

	// Data fetching is still server-side but through tRPC
	// No need to pass result as it is automatically done via hydration
	await getBasicData();

	return (
		<ApproachPageTemplate
			heading="Loading data via tRPC in a React server component (RSC), hydrating via React Query's <Hydrate /> component"
			pros={[""]}
			cons={[""]}
		>
			<TRPCHydrate serverTRPCClient={serverClient}>
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
	const serverClient = getServerTRPCClient();

	await getExpensiveData();

	return (
		<TRPCHydrate serverTRPCClient={serverClient}>
			<ExpensiveMessageClient />
		</TRPCHydrate>
	);
}
