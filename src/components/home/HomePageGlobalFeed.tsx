import Article from "$/components/Article";
import { getServerClient } from "$/lib/trpc/serverClient";
import { Stack, StackDivider } from "@chakra-ui/react";

// Todo: Explore wrapping this in suspense boundary or loading.js?

const DEFAULT_PAGE_SIZE = 10;

type HomePageGlobalFeedProps = {
	page: number;
};

export default async function HomePageGlobalFeed({ page }: HomePageGlobalFeedProps) {
	const articles = await getServerClient().article.getGlobalFeed({
		limit: DEFAULT_PAGE_SIZE,
		offset: (page - 1) * DEFAULT_PAGE_SIZE
	});

	return (
		<Stack gap={2} divider={<StackDivider />}>
			{articles.map((article) => (
				<Article key={article.id} article={article} />
			))}
		</Stack>
		// Todo: Add pagination
	);
}
