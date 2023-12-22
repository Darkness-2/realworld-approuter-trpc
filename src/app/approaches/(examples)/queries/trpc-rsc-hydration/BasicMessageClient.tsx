"use client";

import { trpc } from "$/lib/trpc/client";
import { Text } from "@chakra-ui/react";

export default function BasicMessageClient() {
	const basicMessage = trpc.example.getBasicMessage.useQuery(undefined);

	return (
		<>
			{/* Wrapped in a check for status, even though hydration should ensure it is always loaded */}
			{basicMessage.status === "success" && <Text>Basic message: {basicMessage.data}</Text>}
		</>
	);
}
