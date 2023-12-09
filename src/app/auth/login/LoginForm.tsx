"use client";

import CustomInput from "$/components/forms/CustomInput";
import RootErrorMessage from "$/components/forms/RootErrorMessage";
import SubmitButton from "$/components/forms/SubmitButton";
import { loginUserSchema } from "$/lib/schemas/auth";
import { trpc } from "$/lib/trpc/client";
import { type RouterInputs } from "$/lib/trpc/shared";
import { Box, Stack } from "@chakra-ui/react";
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
			// Deal with expected errors
			if (e.data?.authError && e.data.authError === "INVALID_USERNAME_OR_PASSWORD") {
				setValue("password", "");
				return setError("root", { message: "Invalid username or password" });
			}

			// Something unexpected happened
			console.error(e);
			setError("root", { message: e.message });
		},
		onSettled: () => {
			// Invalidate all queries
			utils.invalidate();
		}
	});

	return (
		<Box as="form" w="full" mt={2} onSubmit={handleSubmit((v) => login.mutate(v))} onChange={() => clearErrors("root")}>
			<Stack gap={4}>
				<RootErrorMessage error={errors.root} />

				<CustomInput id="username" type="text" label="Username" error={errors.username} {...register("username")} />

				<CustomInput id="password" type="password" label="Password" error={errors.password} {...register("password")} />

				<SubmitButton isLoading={login.isLoading}>Login</SubmitButton>
			</Stack>
		</Box>
	);
}
