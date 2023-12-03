"use client";

import Article from "$/components/article/Article";
import ArticleList from "$/components/article/ArticleList";
import { trpc } from "$/lib/trpc/client";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { Button, Flex, Stack, StackDivider } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useMemo, type ComponentProps } from "react";

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

	const queryInputs = { username, limit: pageSize };

	const queryKey = getQueryKey(trpc.article.getArticlesByAuthorUsername, queryInputs, "infinite");
	const state = queryClient.getQueryState(queryKey);

	// Set the initial data if it is fresher than existing data or if no data exists
	if (!state || state.dataUpdatedAt < initialDataTimestamp) {
		console.log("resetting query data");
		console.log(`state refreshed at ${state?.dataUpdatedAt}`);
		console.log(`server data refreshed at ${initialDataTimestamp}`);

		utils.article.getArticlesByAuthorUsername.setInfiniteData(
			queryInputs,
			{ pages: [initialData], pageParams: [undefined] },
			{ updatedAt: initialDataTimestamp }
		);
	}

	const { data, hasNextPage, fetchNextPage, isFetching, isLoading } =
		trpc.article.getArticlesByAuthorUsername.useInfiniteQuery(queryInputs, {
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
		});

	// Merge articles from the pages together and format for the ArticleList component
	const mergedArticles: ComponentProps<typeof ArticleList>["articles"] = useMemo(() => {
		console.log("use memo running");
		console.log(data);
		return (
			data?.pages.flatMap((page) => {
				// Theoretically shouldn't be null as at this point we know the username exists
				if (!page) return [];

				// Add author information back into the articles
				const articles = page.articles.map((article) => ({ ...article, author: { username } }));
				return [...articles];
			}) ?? []
		);
	}, [data, username]);

	return (
		<Stack gap={2} divider={<StackDivider />}>
			{/* Display loading state if loading; otherwise show article list */}
			{isLoading && <Article isLoading={true} />}
			{!isLoading && <ArticleList articles={mergedArticles} />}

			{/* Load more button, only shown if another page is available */}
			<Flex justifyContent="center">
				{hasNextPage && (
					<Button isLoading={isFetching} onClick={() => !isFetching && fetchNextPage()}>
						Load more
					</Button>
				)}
			</Flex>
		</Stack>
	);
}
