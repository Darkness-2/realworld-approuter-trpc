"use client";

import { trpc } from "$/lib/trpc/client";
import { useRouter } from "next/navigation";
import { type FormEvent } from "react";

export default function LogoutButton() {
	const router = useRouter();

	const logout = trpc.auth.logout.useMutation({
		onSuccess: (data) => {
			if (data) {
				router.push(data.redirectTo);
			}
			router.refresh();
		}
	});

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		logout.mutate();
	};

	return (
		<form onSubmit={handleSubmit}>
			<button type="submit">Logout</button>
		</form>
	);
}
