"use client";

import ApproachPageTemplate from "$/app/approaches/ApproachPageTemplate";
import { trpc } from "$/lib/trpc/client";
import { Button, FormLabel, Input, Stack, Text } from "@chakra-ui/react";
import { useState, type FormEvent } from "react";

export default function TRPCClientMutationPage() {
	const [name, setName] = useState("");

	const { status, data, error, isLoading, mutate } = trpc.example.generatePersonalizedMessage.useMutation();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutate(name);
	};

	return (
		<ApproachPageTemplate heading="Mutating data via tRPC, client-side" pros={[""]} cons={[""]}>
			<form onSubmit={handleSubmit}>
				<Stack gap={2}>
					<FormLabel id="name">Enter your name to receive a greeting:</FormLabel>
					<Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
					<Button type="submit" colorScheme="green" w="fit-content" isLoading={isLoading}>
						Submit
					</Button>
				</Stack>
			</form>

			{/* If message returned, show it */}
			{status === "success" && <Text>From the server: {data}</Text>}
			{/* If errors, display them */}
			{status === "error" && (
				<Text textColor="red">{error.data?.zodError?.formErrors.join(", ") ?? "Something went wrong"}</Text>
			)}
			{/* If no data or errors, encourage user to submit */}
			{!data && !error && <Text>Submit your name to receive a message from the server...</Text>}
		</ApproachPageTemplate>
	);
}
