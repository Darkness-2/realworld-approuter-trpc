"use client";

import { useUser } from "$/lib/hooks/auth";
import { usernameCreateSchema } from "$/lib/schemas/auth";
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
			router.refresh();
			toast({
				title: "Username updated",
				description: "Your username was updated successfully",
				status: "success",
				isClosable: true
			});
		},
		onError: (e) => {
			// Deal with expected errors
			if (e.data?.authError === "USERNAME_TAKEN") {
				return setError("username", { message: "This username is taken" });
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
				{errors.root && (
					<Alert status="error">
						<AlertIcon />
						{errors.root.message}
					</Alert>
				)}
				<FormControl isInvalid={!!errors.username}>
					<FormLabel htmlFor="username">New username:</FormLabel>
					<Input
						id="username"
						autoCapitalize="none"
						type="text"
						placeholder={user?.username ?? ""}
						{...register("username")}
					/>
					<FormErrorMessage>{errors.username?.message}</FormErrorMessage>
				</FormControl>
				<Button type="submit" colorScheme="green" px={8} alignSelf="center" disabled={updateUsername.isLoading}>
					{updateUsername.isLoading ? "Loading..." : "Update username"}
				</Button>
			</Stack>
		</Box>
	);
}
