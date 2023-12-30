"use client";

import { getPersonalizedMessage } from "$/app/approaches/(examples)/mutations/trpc-server-action/actions";
import ApproachPageTemplate from "$/app/approaches/ApproachPageTemplate";
import { Button, FormLabel, Input, Stack, Text } from "@chakra-ui/react";
import { useFormState, useFormStatus } from "react-dom";

export default function TRPCServerActionPage() {
	const [state, formAction] = useFormState(getPersonalizedMessage, {});

	return (
		<ApproachPageTemplate heading="Mutating data via tRPC within a Next.js server action" pros={[""]} cons={[""]}>
			<form action={formAction}>
				<Stack gap={2}>
					<FormLabel id="name">Enter your name to receive a greeting:</FormLabel>
					<Input type="text" id="name" name="name" />
					<SubmitButton />
				</Stack>
			</form>

			{/* If message returned, show it */}
			{state.data && <Text>From the server: {state.data}</Text>}
			{/* If errors, display them */}
			{state.errors?.zodError && <Text textColor="red">{state.errors.zodError.formErrors.join(", ")}</Text>}
			{/* If no data or errors, encourage user to submit */}
			{!state.data && !state.errors && <Text>Submit your name to receive a message from the server...</Text>}
		</ApproachPageTemplate>
	);
}

// Separate component in order to make use of useFormStatus hook
function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" colorScheme="green" w="fit-content" isLoading={pending}>
			Submit
		</Button>
	);
}
