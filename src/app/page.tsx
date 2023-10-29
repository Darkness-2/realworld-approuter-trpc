import { getServerClient } from "$/lib/trpc/serverClient";

export default async function Home() {
	const hello = await getServerClient().hello();

	return (
		<main>
			<div>Greeting: {hello}</div>
		</main>
	);
}

export const dynamic = "force-dynamic";
