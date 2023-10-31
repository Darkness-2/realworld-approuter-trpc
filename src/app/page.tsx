import { getServerClient } from "$/lib/trpc/serverClient";

export default async function Home() {
	const hello = await getServerClient().hello();

	return (
		<>
			<div>Greeting: {hello}</div>
		</>
	);
}
