"use client";

import { loginUserSchema } from "$/lib/schemas/auth";
import { trpc } from "$/lib/trpc/client";
import { type RouterInputs } from "$/lib/trpc/shared";
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type LoginForm = RouterInputs["auth"]["login"];

export default function LoginForm() {
	const router = useRouter();
	const utils = trpc.useUtils();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<LoginForm>({
		resolver: zodResolver(loginUserSchema)
	});

	// Todo: Handle validation errors
	const login = trpc.auth.login.useMutation({
		onSuccess: (data) => {
			router.push(data.redirectTo);
			router.refresh();
		},
		onError: (e) => {
			// Todo: Add generic form alert + handle different types of errors
			console.error(e);
		},
		onSettled: () => {
			// Refetch current user
			utils.auth.getCurrentUser.invalidate();
			reset();
		}
	});

	return (
		<Box as="form" onSubmit={handleSubmit((v) => login.mutate(v))} w="full">
			<Stack gap={4}>
				<FormControl isInvalid={!!errors.username}>
					<FormLabel htmlFor="username">Username:</FormLabel>
					<Input id="username" type="text" {...register("username")} />
					<FormErrorMessage>{errors.username?.message}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={!!errors.password}>
					<FormLabel htmlFor="password">Password:</FormLabel>
					<Input id="password" type="password" {...register("password")} />
					<FormErrorMessage>{errors.password?.message}</FormErrorMessage>
				</FormControl>
				<Button type="submit" colorScheme="green" px={8} alignSelf="center" disabled={login.isLoading}>
					{login.isLoading ? "Loading..." : "Login"}
				</Button>
			</Stack>
		</Box>
	);
}
