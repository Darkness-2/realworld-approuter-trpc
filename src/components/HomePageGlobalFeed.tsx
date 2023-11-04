import Article from "$/components/Article";
import { getServerClient } from "$/lib/trpc/serverClient";
import { Stack, StackDivider } from "@chakra-ui/react";

// Todo: Explore wrapping this in suspense boundary or loading.js?

export default async function HomePageGlobalFeed() {
	const articles = await getServerClient().article.getGlobalFeed({});

	return (
		<Stack gap={2} divider={<StackDivider />}>
			{articles.map((article) => (
				<Article key={article.id} article={article} />
			))}
		</Stack>
		// Todo: Add pagination
	);
}
