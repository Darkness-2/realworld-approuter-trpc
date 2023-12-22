"use client";

import { getPersonalizedMessage } from "$/app/approaches/(examples)/mutations/server-action/actions";
import ApproachPageTemplate from "$/app/approaches/ApproachPageTemplate";
import { Button, FormLabel, Input, Stack, Text } from "@chakra-ui/react";
import { useFormState, useFormStatus } from "react-dom";

export default function ServerActionPage() {
	const [state, formAction] = useFormState(getPersonalizedMessage, {});

	return (
		<ApproachPageTemplate heading="Mutating data via a Next.js server action" pros={[""]} cons={[""]}>
			<form action={formAction}>
				<Stack gap={2}>
					<FormLabel id="name">Enter your name to receive a greeting:</FormLabel>
					<Input type="text" id="name" name="name" />
					<SubmitButton />
				</Stack>
			</form>

			{state.data && <Text>From the server: {state.data}</Text>}
			{state.errors && <Text textColor="red">{state.errors.formErrors.join(", ")}</Text>}
			{!state.data && !state.errors && <Text>Submit your name to receive a message from the server...</Text>}
		</ApproachPageTemplate>
	);
}

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" colorScheme="green" w="fit-content" isLoading={pending}>
			Submit
		</Button>
	);
}
