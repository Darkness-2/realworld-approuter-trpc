"use client";

import CustomInput from "$/components/forms/CustomInput";
import RootErrorMessage from "$/components/forms/RootErrorMessage";
import SubmitButton from "$/components/forms/SubmitButton";
import { useUser } from "$/lib/hooks/auth";
import { usernameCreateSchema } from "$/lib/schemas/auth";
import { trpc } from "$/lib/trpc/client";
import { type RouterInputs } from "$/lib/trpc/shared";
import { Box, Stack, Text, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

type UpdateUsernameForm = { username: RouterInputs["auth"]["updateUsername"] };

export default function UpdateUsernameForm() {
	const router = useRouter();
	const toast = useToast();
	const utils = trpc.useUtils();
	const { user } = useUser();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		clearErrors,
		reset
	} = useForm<UpdateUsernameForm>({
		resolver: zodResolver(z.object({ username: usernameCreateSchema }))
	});

	const updateUsername = trpc.auth.updateUsername.useMutation({
		onSuccess: () => {
			// Clear form, show success message, clear router cache
			reset();

			toast({
				title: "Username updated",
				description: "Your username was updated successfully",
				status: "success",
				isClosable: true
			});

			router.refresh();
		},
		onError: (e) => {
			// Deal with expected errors
			if (e.data?.authError === "USERNAME_TAKEN") {
				return setError("username", { message: "That username is already taken" });
			}

			// Something unexpected happened
			console.error(e);
			setError("root", { message: "Something went wrong" });
		},
		onSettled: () => {
			// Refetch current user
			utils.auth.getCurrentUser.invalidate();
		}
	});

	return (
		<Box
			as="form"
			w="full"
			mt={2}
			onSubmit={handleSubmit((v) => updateUsername.mutate(v.username))}
			onChange={() => clearErrors("root")}
		>
			<Stack gap={4}>
				<Text as="h2" fontSize="2xl">
					Update username
				</Text>

				<RootErrorMessage error={errors.root} />

				<CustomInput
					id="username"
					type="text"
					label="New username"
					autoCapitalize="none"
					placeholder={user?.username ?? ""}
					error={errors.username}
					{...register("username")}
				/>

				<SubmitButton isLoading={updateUsername.isLoading}>Update username</SubmitButton>
			</Stack>
		</Box>
	);
}
