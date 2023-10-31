"use client";

import { trpc } from "$/lib/trpc/client";
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
		<form onSubmit={handleSubmit}>
			<label htmlFor="username">Username:</label>
			<input type="text" name="username" id="username" value={formData.username} onChange={handleChange} />
			<br />
			<label htmlFor="password">Password:</label>
			<input type="text" name="password" id="password" value={formData.password} onChange={handleChange} />
			<br />
			<input type="submit" />
		</form>
	);
}
