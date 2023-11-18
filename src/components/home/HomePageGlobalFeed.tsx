import Article from "$/components/Article";
import PaginationButtons from "$/components/ui/PaginationButtons";
import { getServerClient } from "$/lib/trpc/serverClient";
import { Stack, StackDivider } from "@chakra-ui/react";
import { notFound } from "next/navigation";

// Todo: Explore wrapping this in suspense boundary or loading.js?

const DEFAULT_PAGE_SIZE = 10;

type HomePageGlobalFeedProps = {
	page: number;
};

export default async function HomePageGlobalFeed({ page }: HomePageGlobalFeedProps) {
	// If going to a zero or negative page, throw not found
	if (page < 1) notFound();

	const { articles, totalCount } = await getServerClient().article.getGlobalFeed({
		limit: DEFAULT_PAGE_SIZE,
		offset: (page - 1) * DEFAULT_PAGE_SIZE
	});

	// If viewing a page without any articles, throw not found
	if (articles.length === 0) notFound();

	return (
		<Stack gap={2} divider={<StackDivider />}>
			{articles.map((article) => (
				<Article key={article.id} article={article} />
			))}
			<PaginationButtons currentPage={page} lastPage={Math.ceil(totalCount / DEFAULT_PAGE_SIZE)} />
		</Stack>
	);
}
