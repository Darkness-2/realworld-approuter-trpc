import { getServerClient } from "$/lib/trpc/serverClient";

// Todo: Explore wrapping this in suspense boundary or loading.js?

export default async function HomePageGlobalFeed() {
	const articles = await getServerClient().article.getGlobalFeed({});

	return <div>HomeGlobalFeed</div>;
}
