"use client";

import { trpc } from "$/lib/trpc/client";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function TRPCRSCButtons() {
	const router = useRouter();
	const utils = trpc.useUtils();

	const handleRouterRefresh = () => {
		router.refresh();
	};

	const handleTRPCInvalidate = () => {
		utils.example.getExpensiveMessage.invalidate();
	};

	return (
		<>
			<Button onClick={handleRouterRefresh}>Refresh data (router.refresh)</Button>
			<Button onClick={handleTRPCInvalidate}>Refresh data (tRPC / React query invalidate)</Button>
		</>
	);
}
