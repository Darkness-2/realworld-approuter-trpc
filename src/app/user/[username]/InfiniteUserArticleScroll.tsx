"use client";

import ArticleList from "$/components/article/ArticleList";
import { trpc } from "$/lib/trpc/client";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { Button } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { type ComponentProps } from "react";

type InfiniteArticleScrollProps = {
	username: string;
	initialData: RouterOutputs["article"]["getArticlesByAuthorUsername"];
	initialDataTimestamp: number;
	pageSize: number;
};

export default function InfiniteUserArticleScroll({
	username,
	initialData,
	initialDataTimestamp,
	pageSize
}: InfiniteArticleScrollProps) {
	const utils = trpc.useUtils();
	const queryClient = useQueryClient();

	const queryKey = getQueryKey(trpc.article.getArticlesByAuthorUsername, { username, limit: pageSize }, "infinite");
	const state = queryClient.getQueryState(queryKey);

	// Set the initial data if it is fresher than existing data or if no data exists
	if (!state || state.dataUpdatedAt < initialDataTimestamp) {
		utils.article.getArticlesByAuthorUsername.setInfiniteData(
			{ username, limit: pageSize },
			{ pages: [initialData], pageParams: [undefined] },
			{ updatedAt: initialDataTimestamp }
		);
	}

	const { data, hasNextPage, fetchNextPage, isFetching, isLoading } =
		trpc.article.getArticlesByAuthorUsername.useInfiniteQuery(
			{ username, limit: pageSize },
			{
				getNextPageParam: (lastPage) => {
					// Shouldn't theoretically happen as at this point we know the username exists
					if (!lastPage) return undefined;

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
	// Todo: Does tanstack not cover this automatically in select?
	const mergedArticles: ComponentProps<typeof ArticleList>["articles"] =
		data?.pages.flatMap((page) => {
			// Theoretically shouldn't be null as at this point we know the username exists
			if (!page) return [];

			// Add author information back into the articles
			const articles = page.articles.map((article) => ({ ...article, author: { username } }));
			return [...articles];
		}) ?? [];

	return (
		<>
			{/* Todo: Add loading state */}
			{!isLoading && <ArticleList articles={mergedArticles} />}
			{/* Todo: Loading state for this button */}
			{hasNextPage && <Button onClick={() => !isFetching && fetchNextPage()}>Fetch more</Button>}
		</>
	);
}
