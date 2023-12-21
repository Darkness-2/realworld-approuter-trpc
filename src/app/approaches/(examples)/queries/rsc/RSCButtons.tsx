"use client";

import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function RSCButtons() {
	const router = useRouter();

	const handleRefreshData = () => {
		router.refresh();
	};

	return (
		<>
			<Button onClick={handleRefreshData}>Refresh data (router.refresh)</Button>
		</>
	);
}
