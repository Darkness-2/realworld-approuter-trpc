"use client";

import { trpc } from "$/lib/trpc/client";
import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LogoutPage() {
	const router = useRouter();
	const utils = trpc.useUtils();

	// Need to wrap in useState to ensure effect doesn't fire many times
	const [logout] = useState(
		trpc.auth.logout.useMutation({
			onSuccess: (data) => {
				router.push(data.redirectTo);
				router.refresh();
			},
			onSettled: () => {
				// Refetch current user
				utils.auth.getCurrentUser.invalidate();
			}
		})
	);

	useEffect(() => {
		logout.mutate();
	}, [logout]);

	return <Spinner />;
}
