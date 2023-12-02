"use client";

import ArticleList from "$/components/article/ArticleList";
import { trpc } from "$/lib/trpc/client";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { findLastPageNumber, getLimitOffsetForPage } from "$/lib/utils/helpers";
import { Skeleton } from "@chakra-ui/react";
import { notFound, useSearchParams } from "next/navigation";

// Todo: Explore wrapping this in suspense boundary or loading.js?

type HomePageGlobalFeedProps = {
	// Loader will always give results for page 1
	initialData: RouterOutputs["article"]["getGlobalFeed"];
	pageSize: number;
};

export default function HomePageGlobalFeedClient({ initialData, pageSize }: HomePageGlobalFeedProps) {
	const searchParams = useSearchParams();

	const page = parseInt(searchParams.get("page") ?? "1");
	const lastPage = findLastPageNumber(initialData.totalCount, pageSize);

	// Deal with pages that are out of range
	if (isNaN(page) || page < 1 || page > lastPage) notFound();

	// Todo: Consider what fetch settings to use here - do we want stale data?
	const globalFeedQuery = trpc.article.getGlobalFeed.useQuery(getLimitOffsetForPage(page, pageSize), {
		// Store server-generated data if the page is 1
		initialData: page === 1 ? initialData : undefined,
		refetchOnWindowFocus: false
	});

	return (
		<>
			{/* If query is loading, display skeleton */}
			{/* Todo: Generate an article skeleton */}
			{globalFeedQuery.isLoading && <Skeleton h="100px" w="100px" />}
			{/* Otherwise, show the articles */}
			{globalFeedQuery.data && (
				<ArticleList articles={globalFeedQuery.data.articles} paginationOptions={{ currentPage: page, lastPage }} />
			)}
		</>
	);
}
