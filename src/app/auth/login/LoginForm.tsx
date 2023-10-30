"use client";

import { trpc } from "$/lib/trpc/client";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";

export default function LoginForm() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		username: "",
		password: ""
	});

	// Todo: Handle validation error
	const login = trpc.auth.login.useMutation({
		onSuccess: (data) => {
			if (data.success) {
				router.push(data.redirectTo);
				router.refresh();
			} else {
				// Todo: Handle errors better
			}
		}
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};

	const handleRequest = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		login.mutate(formData);
	};

	console.log(formData);

	return (
		<form onSubmit={handleRequest}>
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
