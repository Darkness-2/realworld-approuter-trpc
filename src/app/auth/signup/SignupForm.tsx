"use client";

import { createUserSchema } from "$/lib/schemas/auth";
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
	Stack
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type SignupForm = RouterInputs["auth"]["signup"];

export default function SignupForm() {
	const router = useRouter();
	const utils = trpc.useUtils();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		clearErrors
	} = useForm<SignupForm>({
		resolver: zodResolver(createUserSchema)
	});

	const signup = trpc.auth.signup.useMutation({
		onSuccess: (data) => {
			router.push(data.redirectTo);
			router.refresh();
		},
		onError: (e) => {
			// Deal with expected errors
			if (e.data?.authError && e.data.authError === "USERNAME_TAKEN") {
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
			onSubmit={handleSubmit((v) => signup.mutate(v))}
			onChange={() => clearErrors("root")}
		>
			<Stack gap={4}>
				{errors.root && (
					<Alert status="error">
						<AlertIcon />
						{errors.root.message}
					</Alert>
				)}
				{/* Todo: extract inputs to new ui component */}
				<FormControl isInvalid={!!errors.username}>
					<FormLabel htmlFor="username">Username:</FormLabel>
					<Input id="username" autoCapitalize="none" type="text" {...register("username")} />
					<FormErrorMessage>{errors.username?.message}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={!!errors.password}>
					<FormLabel htmlFor="password">Password:</FormLabel>
					<Input id="password" type="password" {...register("password")} />
					<FormErrorMessage>{errors.password?.message}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={!!errors.confirmPassword}>
					<FormLabel htmlFor="confirmPassword">Confirm password:</FormLabel>
					<Input id="confirmPassword" type="password" {...register("confirmPassword")} />
					<FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
				</FormControl>
				<Button type="submit" colorScheme="green" px={8} alignSelf="center" disabled={signup.isLoading}>
					{signup.isLoading ? "Loading..." : "Sign up"}
				</Button>
			</Stack>
		</Box>
	);
}
