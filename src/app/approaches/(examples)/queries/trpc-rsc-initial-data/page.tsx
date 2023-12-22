import BasicMessageClient from "$/app/approaches/(examples)/queries/trpc-rsc-initial-data/BasicMessageClient";
import ExpensiveMessageClient from "$/app/approaches/(examples)/queries/trpc-rsc-initial-data/ExpensiveMessageClient";
import ApproachPageTemplate from "$/app/approaches/ApproachPageTemplate";
import { getServerTRPCClient } from "$/lib/trpc/serverClient";
import { Text } from "@chakra-ui/react";
import { Suspense } from "react";

const getBasicData = async () => {
	return await getServerTRPCClient().example.getBasicMessage.fetch();
};

const getExpensiveData = async () => {
	return await getServerTRPCClient().example.getExpensiveMessage.fetch();
};

export default async function TRPCRSCInitialDataPage() {
	// Data fetching is still server-side but through tRPC
	const message = await getBasicData();

	return (
		<ApproachPageTemplate
			heading="Loading data via tRPC in a React server component (RSC), hydrating via initial data"
			displayButtons
			pros={[""]}
			cons={[""]}
		>
			<BasicMessageClient initialData={message} />

			{/* Wrapped in suspense as it takes longer to load */}
			<Suspense fallback={<Text>Loading expensive message...</Text>}>
				<ExpensiveMessageServer />
			</Suspense>
		</ApproachPageTemplate>
	);
}

// Separating out slow data fetching so we can surround it with suspense
async function ExpensiveMessageServer() {
	const message = await getExpensiveData();

	return <ExpensiveMessageClient initialData={message} />;
}
