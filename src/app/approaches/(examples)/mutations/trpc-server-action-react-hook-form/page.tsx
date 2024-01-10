"use client";

import { generatePersonalizedMessage } from "$/app/approaches/(examples)/mutations/trpc-server-action-react-hook-form/actions";
import ApproachPageTemplate from "$/app/approaches/ApproachPageTemplate";
import { messageNameSchema } from "$/lib/schemas/example";
import { type RouterInputs } from "$/lib/trpc/shared";
import { Button, FormLabel, Input, Stack, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

type GeneratePersonalizedMessageForm = { name: RouterInputs["example"]["generatePersonalizedMessage"] };

export default function TRPCServerActionReactHookFormPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
		setError
	} = useForm<GeneratePersonalizedMessageForm>({
		resolver: zodResolver(z.object({ name: messageNameSchema }))
	});

	const { status, data, isLoading, mutate } = useMutation({
		mutationFn: async () => {
			const result = await generatePersonalizedMessage(getValues("name"));

			// If successful, return data
			if (result.state === "success") return result.data;

			// Handle validation errors
			// Technically optional as validation also occurs client-side
			if (result.errors.zodError) {
				setError("name", { message: result.errors.zodError.formErrors.join(", ") });
				throw new Error("Validation error");
			}

			// Something unexpected happened
			setError("name", { message: "Something went wrong" });
			throw new Error("Unexpected error");
		}
	});

	return (
		<ApproachPageTemplate
			heading="Mutating data via tRPC within a Next.js server action, using react-hook-form"
			pros={[""]}
			cons={[""]}
		>
			<form onSubmit={handleSubmit(() => mutate())}>
				<Stack gap={2}>
					<FormLabel id="name">Enter your name to receive a greeting:</FormLabel>
					<Input type="text" id="name" {...register("name")} />
					<Button type="submit" colorScheme="green" w="fit-content" isLoading={isLoading}>
						Submit
					</Button>
				</Stack>
			</form>

			{/* If message returned, show it */}
			{status === "success" && <Text>From the server: {data}</Text>}
			{/* If validation errors, display them */}
			{errors.name && <Text textColor="red">{errors.name.message}</Text>}
			{/* If no data, encourage user to submit */}
			{status === "idle" && <Text>Submit your name to receive a message from the server...</Text>}
		</ApproachPageTemplate>
	);
}
