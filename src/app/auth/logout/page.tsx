"use client";

import { trpc } from "$/lib/trpc/client";
import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
	const router = useRouter();
	const utils = trpc.useUtils();

	const { mutate } = trpc.auth.logout.useMutation({
		onSuccess: (data) => {
			router.push(data.redirectTo);
			router.refresh();
		},
		onSettled: () => {
			// Refetch current user
			utils.auth.getCurrentUser.invalidate();
		}
	});

	useEffect(() => {
		mutate();
	}, [mutate]);

	// Todo: Format this page properly
	return <Spinner />;
}
