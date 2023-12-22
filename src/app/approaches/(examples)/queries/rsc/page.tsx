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
	// Data fetching directly in the server component
	const message = await getBasicData();

	return (
		<ApproachPageTemplate
			heading="Loading data via a React server component (RSC)"
			displayButtons
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

// Separating out slow data fetching so we can surround it with suspense
async function ExpensiveMessage() {
	const message = await getExpensiveData();

	return <Text>Expensive message: {message}</Text>;
}
