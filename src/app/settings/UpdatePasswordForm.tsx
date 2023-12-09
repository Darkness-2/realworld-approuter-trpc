"use client";

import CustomInput from "$/components/forms/CustomInput";
import RootErrorMessage from "$/components/forms/RootErrorMessage";
import SubmitButton from "$/components/forms/SubmitButton";
import { updatePasswordSchema } from "$/lib/schemas/auth";
import { trpc } from "$/lib/trpc/client";
import { type RouterInputs } from "$/lib/trpc/shared";
import { Box, Stack, Text, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type UpdatePasswordForm = RouterInputs["auth"]["updatePassword"];

export default function UpdatePasswordForm() {
	const toast = useToast();
	const utils = trpc.useUtils();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		clearErrors,
		reset
	} = useForm<UpdatePasswordForm>({
		resolver: zodResolver(updatePasswordSchema)
	});

	const updatePassword = trpc.auth.updatePassword.useMutation({
		onSuccess: () => {
			// Clear form and show success message
			reset();
			toast({
				title: "Password updated",
				description: "Your password was updated successfully",
				status: "success",
				isClosable: true
			});
		},
		onError: (e) => {
			// Deal with expected errors
			if (e.data?.authError && e.data.authError === "INVALID_USERNAME_OR_PASSWORD") {
				return setError("currentPassword", { message: "Your password was incorrect" });
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
			onSubmit={handleSubmit((v) => updatePassword.mutate(v))}
			onChange={() => clearErrors("root")}
		>
			<Stack gap={4}>
				<Text as="h2" fontSize="2xl">
					Update password
				</Text>

				<RootErrorMessage error={errors.root} />

				<CustomInput
					id="currentPassword"
					type="password"
					label="Current password"
					error={errors.currentPassword}
					{...register("currentPassword")}
				/>

				<CustomInput
					id="newPassword"
					type="password"
					label="New password"
					error={errors.newPassword}
					{...register("newPassword")}
				/>

				<CustomInput
					id="confirmNewPassword"
					type="password"
					label="Confirm new password"
					error={errors.confirmNewPassword}
					{...register("confirmNewPassword")}
				/>

				<SubmitButton isLoading={updatePassword.isLoading}>Update password</SubmitButton>
			</Stack>
		</Box>
	);
}
