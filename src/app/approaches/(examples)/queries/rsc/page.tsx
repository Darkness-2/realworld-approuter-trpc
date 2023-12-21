import RSCButtons from "$/app/approaches/(examples)/queries/rsc/RSCButtons";
import ApproachPageTemplate from "$/app/approaches/ApproachPageTemplate";
import { generateBasicMessage, generateExpensiveMessage } from "$/lib/utils/example";
import { Text } from "@chakra-ui/react";
import { Suspense } from "react";

const getBasicData = async () => {
	return await generateBasicMessage();
};

const getExpensiveData = async () => {
	return await generateExpensiveMessage();
};

export default async function RSCQueryPage() {
	const message = await getBasicData();

	return (
		<ApproachPageTemplate
			heading="Loading data via a React server component (RSC)"
			buttons={<RSCButtons />}
			pros={[""]}
			cons={[""]}
		>
			<Text>Basic message: {message}</Text>

			{/* Wrapped in suspense as it takes longer to load */}
			<Suspense fallback={<Text>Loading expensive message...</Text>}>
				<ExpensiveMessage />
			</Suspense>
		</ApproachPageTemplate>
	);
}

async function ExpensiveMessage() {
	const message = await getExpensiveData();

	return <Text>Expensive message: {message}</Text>;
}
