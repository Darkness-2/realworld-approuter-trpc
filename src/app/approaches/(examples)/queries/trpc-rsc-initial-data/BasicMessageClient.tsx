"use client";

import { trpc } from "$/lib/trpc/client";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { Text } from "@chakra-ui/react";

type BasicMessageClientProps = {
	initialData: RouterOutputs["example"]["getBasicMessage"];
};

// Requires a client component to populate the tRPC procedure client-side
export default function BasicMessageClient({ initialData }: BasicMessageClientProps) {
	const basicMessage = trpc.example.getBasicMessage.useQuery(undefined, {
		initialData
	});

	return <Text>Basic message: {basicMessage.data}</Text>;
}
