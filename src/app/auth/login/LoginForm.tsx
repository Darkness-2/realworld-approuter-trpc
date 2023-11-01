"use client";

import { loginUserSchema } from "$/lib/schemas/auth";
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

type LoginForm = RouterInputs["auth"]["login"];

export default function LoginForm() {
	const router = useRouter();
	const utils = trpc.useUtils();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		setValue,
		clearErrors
	} = useForm<LoginForm>({
		resolver: zodResolver(loginUserSchema)
	});

	const login = trpc.auth.login.useMutation({
		onSuccess: (data) => {
			router.push(data.redirectTo);
			router.refresh();
		},
		onError: (e) => {
			if (e.data?.code === "UNAUTHORIZED") {
				setError("root", { message: e.message });
				setValue("password", "");
			}

			setError("root", { message: e.message });
			console.error(e);
		},
		onSettled: () => {
			// Refetch current user and reset password field
			utils.auth.getCurrentUser.invalidate();
		}
	});

	return (
		<Box as="form" onSubmit={handleSubmit((v) => login.mutate(v))} onChange={() => clearErrors("root")} w="full" mt={2}>
			<Stack gap={4}>
				{errors.root && (
					<Alert status="error">
						<AlertIcon />
						{errors.root.message}
					</Alert>
				)}
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
				<Button type="submit" colorScheme="green" px={8} alignSelf="center" disabled={login.isLoading}>
					{login.isLoading ? "Loading..." : "Login"}
				</Button>
			</Stack>
		</Box>
	);
}
