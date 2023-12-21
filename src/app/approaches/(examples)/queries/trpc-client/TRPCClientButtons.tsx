"use client";

import { trpc } from "$/lib/trpc/client";
import { Button } from "@chakra-ui/react";

export default function TRPCClientButtons() {
	const utils = trpc.useUtils();

	const handleRefreshData = () => {
		utils.example.getBasicMessage.invalidate();
		utils.example.getExpensiveMessage.invalidate();
	};

	return (
		<>
			<Button onClick={handleRefreshData}>Refresh data (tRPC / React query invalidate)</Button>
		</>
	);
}
