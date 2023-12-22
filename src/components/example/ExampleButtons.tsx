"use client";

import { trpc } from "$/lib/trpc/client";
import { Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function ExampleButtons() {
	const router = useRouter();
	const utils = trpc.useUtils();

	const handleRouterRefresh = () => {
		router.refresh();
	};

	const handleTRPCInvalidate = () => {
		utils.example.getBasicMessage.invalidate();
		utils.example.getExpensiveMessage.invalidate();
	};

	return (
		<Flex gap={2} wrap="wrap">
			<Button onClick={handleRouterRefresh}>Refresh data (router.refresh)</Button>
			<Button onClick={handleTRPCInvalidate}>Refresh data (tRPC / React query invalidate)</Button>
		</Flex>
	);
}
