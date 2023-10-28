"use client";

import { trpc } from "$/lib/trpc/client";

export default function ClientExample() {
	const getHello = trpc.hello.useQuery();

	return <div>{getHello.data}</div>;
}
