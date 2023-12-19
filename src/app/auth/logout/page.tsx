"use client";

import { trpc } from "$/lib/trpc/client";
import { Flex, Spinner } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { mutate } = trpc.auth.logout.useMutation({
		onSuccess: (data) => {
			router.push(data.redirectTo);
		},
		onSettled: () => {
			// Clear the query client cache and refresh router
			queryClient.clear();
			router.refresh();
		}
	});

	useEffect(() => {
		mutate();
	}, [mutate]);

	return (
		<Flex flexGrow={1} justifyContent="center" alignItems="center">
			<Spinner size="xl" />
		</Flex>
	);
}
