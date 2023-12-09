"use client";

import CustomInput from "$/components/forms/CustomInput";
import RootErrorMessage from "$/components/forms/RootErrorMessage";
import SubmitButton from "$/components/forms/SubmitButton";
import { createUserSchema } from "$/lib/schemas/auth";
import { trpc } from "$/lib/trpc/client";
import { type RouterInputs } from "$/lib/trpc/shared";
import { Box, Stack } from "@chakra-ui/react";
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
			// Refetch all queries
			utils.invalidate();
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
				<RootErrorMessage error={errors.root} />

				<CustomInput
					id="username"
					type="text"
					label="Username"
					autoCapitalize="none"
					error={errors.username}
					{...register("username")}
				/>

				<CustomInput id="password" type="password" label="Password" error={errors.password} {...register("password")} />

				<CustomInput
					id="confirmPassword"
					type="password"
					label="Confirm password"
					error={errors.confirmPassword}
					{...register("confirmPassword")}
				/>

				<SubmitButton isLoading={signup.isLoading}>Sign up</SubmitButton>
			</Stack>
		</Box>
	);
}
