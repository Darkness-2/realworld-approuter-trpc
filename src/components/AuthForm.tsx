"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
	action: string;
};

export default function AuthForm({ action, children }: Props) {
	const router = useRouter();

	return (
		<form
			action={action}
			method="post"
			onSubmit={async (e) => {
				e.preventDefault();
				const formData = new FormData(e.currentTarget);
				const response = await fetch(action, {
					method: "POST",
					body: formData,
					redirect: "manual"
				});

				if (response.status === 0) {
					// redirected; redirect manual results in 0
					return router.refresh();
				}
			}}
		>
			{children}
		</form>
	);
}
