"use client";

import { updatePasswordSchema } from "$/lib/schemas/auth";
import { trpc } from "$/lib/trpc/client";
import { type RouterInputs } from "$/lib/trpc/shared";
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Stack,
	Text,
	useToast
} from "@chakra-ui/react";
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
				{errors.root && (
					<Alert status="error">
						<AlertIcon />
						{errors.root.message}
					</Alert>
				)}
				<FormControl isInvalid={!!errors.currentPassword}>
					<FormLabel htmlFor="currentPassword">Current password:</FormLabel>
					<Input id="currentPassword" autoCapitalize="none" type="password" {...register("currentPassword")} />
					<FormErrorMessage>{errors.currentPassword?.message}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={!!errors.newPassword}>
					<FormLabel htmlFor="newPassword">New password:</FormLabel>
					<Input id="newPassword" autoCapitalize="none" type="password" {...register("newPassword")} />
					<FormErrorMessage>{errors.newPassword?.message}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={!!errors.confirmNewPassword}>
					<FormLabel htmlFor="currentPassword">Confirm new password:</FormLabel>
					<Input id="confirmNewPassword" autoCapitalize="none" type="password" {...register("confirmNewPassword")} />
					<FormErrorMessage>{errors.confirmNewPassword?.message}</FormErrorMessage>
				</FormControl>
				<Button type="submit" colorScheme="green" px={8} alignSelf="center" disabled={updatePassword.isLoading}>
					{updatePassword.isLoading ? "Loading..." : "Update password"}
				</Button>
			</Stack>
		</Box>
	);
}
