"use client";

import Article from "$/components/article/Article";
import PaginationButtons from "$/components/ui/PaginationButtons";
import { trpc } from "$/lib/trpc/client";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { Skeleton, Stack, StackDivider } from "@chakra-ui/react";
import { notFound, useSearchParams } from "next/navigation";

// Todo: Explore wrapping this in suspense boundary or loading.js?

type HomePageGlobalFeedProps = {
	// Loader will always give results for page 1
	globalFeed: RouterOutputs["article"]["getGlobalFeed"];
	pageSize: number;
};

export default function HomePageGlobalFeed({ globalFeed, pageSize }: HomePageGlobalFeedProps) {
	const searchParams = useSearchParams();

	const page = parseInt(searchParams.get("page") ?? "1");
	const lastPage = Math.ceil(globalFeed.totalCount / pageSize);

	// Deal with pages that are out of range
	if (isNaN(page) || page < 1 || page > lastPage) notFound();

	// Todo: Consider what fetch settings to use here - do we want stale data?
	const globalFeedQuery = trpc.article.getGlobalFeed.useQuery(
		{ limit: pageSize, offset: (page - 1) * pageSize },
		{
			// Store server-generated data if the page is 1
			initialData: page === 1 ? globalFeed : undefined,
			refetchOnWindowFocus: false
		}
	);

	return (
		<Stack gap={2} divider={<StackDivider />}>
			{/* If query is loading, display skeleton */}
			{/* Todo: Generate an article skeleton */}
			{globalFeedQuery.isLoading && <Skeleton h="100px" w="100px" />}
			{/* Otherwise, show the articles */}
			{globalFeedQuery.data &&
				globalFeedQuery.data.articles.map((article) => <Article key={article.id} article={article} />)}
			<PaginationButtons currentPage={page} lastPage={lastPage} />
		</Stack>
	);
}
