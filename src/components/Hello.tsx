import { getServerClient } from "$/lib/trpc/serverClient";

export default async function Hello() {
	const hello = await getServerClient().hello();

	return <>{hello}</>;
}
