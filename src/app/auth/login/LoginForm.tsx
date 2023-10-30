"use client";

import { trpc } from "$/lib/trpc/client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function LoginForm() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	// Todo: Handle validation error
	const login = trpc.auth.login.useMutation({
		onSuccess: (data) => {
			if (data.success) {
				router.push(data.redirectTo);
			} else {
				// Todo: Handle errors better
			}
		}
	});

	const handleRequest = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		login.mutate({ password, username });
	};

	return (
		<form onSubmit={handleRequest}>
			<label htmlFor="username">Username:</label>
			<input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
			<br />
			<label htmlFor="password">Password:</label>
			<input type="text" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
			<br />
			<input type="submit" />
		</form>
	);
}
