"use client";

import { trpc } from "$/lib/trpc/client";
import { useRouter } from "next/navigation";
import { type FormEvent } from "react";

export default function LogoutButton() {
	const router = useRouter();
	const utils = trpc.useUtils();

	const logout = trpc.auth.logout.useMutation({
		onSuccess: (data) => {
			if (data) {
				router.push(data.redirectTo);
			}
			router.refresh();
		},
		onSettled: () => {
			// Refetch current user
			utils.auth.getCurrentUser.invalidate();
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
