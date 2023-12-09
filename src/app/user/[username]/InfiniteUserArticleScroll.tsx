"use client";

import Article from "$/components/article/Article";
import ArticleList from "$/components/article/ArticleList";
import { trpc } from "$/lib/trpc/client";
import { Button, Flex, Stack, StackDivider } from "@chakra-ui/react";
import { type ComponentProps } from "react";

type InfiniteArticleScrollProps = {
	username: string;
	pageSize: number;
};

export default function InfiniteUserArticleScroll({ username, pageSize }: InfiniteArticleScrollProps) {
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
	// Todo: Can react query select do this?
	const mergedArticles: ComponentProps<typeof ArticleList>["articles"] =
		data?.pages.flatMap((page) => {
			// Theoretically shouldn't be null as at this point we know the username exists
			if (!page) return [];

			// Add author information back into the articles
			const articles = page.articles.map((article) => ({ ...article, author: { username } }));
			return [...articles];
		}) ?? [];

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
