"use client";

import Article from "$/components/article/Article";
import ArticleList from "$/components/article/ArticleList";
import LoadMoreButton from "$/components/ui/LoadMoreButton";
import { trpc } from "$/lib/trpc/client";
import { Stack, StackDivider } from "@chakra-ui/react";
import { type ComponentProps } from "react";

type LikedArticlesInfiniteScrollProps = {
	userId: string;
	pageSize: number;
};

export default function LikedArticlesInfiniteScroll({ pageSize, userId }: LikedArticlesInfiniteScrollProps) {
	const { data, hasNextPage, fetchNextPage, isFetching, isLoading } = trpc.article.getLikedArticles.useInfiniteQuery(
		{ userId, limit: pageSize },
		{
			getNextPageParam: (lastPage) => {
				// If there are no more pages, return undefined
				if (!lastPage.hasMore) return undefined;

				// Else, return the last createdAt timestamp
				const lastArticle = lastPage.articles.slice(-1);
				return lastArticle?.[0]?.createdAt;
			},
			// Setting stale time to the same as the page revalidate time
			// Mutations changing articles should call article.invalidate anyway
			staleTime: 5 * 60 * 1000
		}
	);

	// Merge articles from the pages together and format for the ArticleList component
	const mergedArticles: ComponentProps<typeof ArticleList>["articles"] =
		data?.pages.flatMap((page) => page.articles) ?? [];

	return (
		<Stack gap={2} divider={<StackDivider />}>
			{/* Display loading state if loading; otherwise show article list */}
			{isLoading && <Article isLoading={true} />}
			{!isLoading && <ArticleList articles={mergedArticles} />}

			{/* Load more button, only shown if another page is available */}
			<LoadMoreButton isFetching={isFetching} hasNextPage={hasNextPage} onClick={fetchNextPage} />
		</Stack>
	);
}
