"use client";

import { trpc } from "$/lib/trpc/client";
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Stack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";

export default function LoginForm() {
	const router = useRouter();
	const utils = trpc.useUtils();
	const [formData, setFormData] = useState({
		username: "",
		password: ""
	});

	// Todo: Handle validation errors
	const login = trpc.auth.login.useMutation({
		onSuccess: (data) => {
			router.push(data.redirectTo);
			router.refresh();
		},
		onSettled: () => {
			// Refetch current user
			utils.auth.getCurrentUser.invalidate();
		}
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		login.mutate(formData);
	};

	return (
		<Box as="form" onSubmit={handleSubmit} w="full">
			<Stack gap={4}>
				<FormControl>
					<FormLabel htmlFor="username">Username:</FormLabel>
					<Input id="username" name="username" value={formData.username} onChange={handleChange} />
					<FormErrorMessage>Test</FormErrorMessage>
				</FormControl>
				<FormControl>
					<FormLabel htmlFor="password">Password:</FormLabel>
					<Input id="password" name="password" value={formData.password} onChange={handleChange} />
					<FormErrorMessage>Test</FormErrorMessage>
				</FormControl>
				<Button type="submit" colorScheme="green" px={8} alignSelf="center">
					Submit
				</Button>
			</Stack>
		</Box>
	);
}
