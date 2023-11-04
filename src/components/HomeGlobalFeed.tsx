import { getServerClient } from "$/lib/trpc/serverClient";

export default async function HomeGlobalFeed() {
	const articles = await getServerClient().article.getGlobalFeed({});

	return <div>HomeGlobalFeed</div>;
}
