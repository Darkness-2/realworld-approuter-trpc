"use client";

import ArticleList from "$/components/article/ArticleList";
import { trpc } from "$/lib/trpc/client";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { Button } from "@chakra-ui/react";
import { type ComponentProps } from "react";

type InfiniteArticleScrollProps = {
	username: string;
	initialData: RouterOutputs["article"]["getArticlesByAuthorUsername"];
	pageSize: number;
};

export default function InfiniteUserArticleScroll({ username, initialData, pageSize }: InfiniteArticleScrollProps) {
	const { data, hasNextPage, fetchNextPage, isFetching } = trpc.article.getArticlesByAuthorUsername.useInfiniteQuery(
		{ username, limit: pageSize },
		{
			initialData: {
				pages: [initialData],
				pageParams: []
			},
			initialDataUpdatedAt: new Date().getTime(),
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
	// Todo: Does tanstack not cover this automatically?
	const mergedArticles: ComponentProps<typeof ArticleList>["articles"] | undefined = data?.pages.flatMap((page) => {
		// Returns theoretically shouldn't be null as at this point we know the username exists
		if (!page) return [];

		// Add author information back into the articles
		const articles = page.articles.map((article) => ({ ...article, author: { username } }));
		return [...articles];
	});

	return (
		<>
			{/* Todo: Add loading state */}
			{mergedArticles && <ArticleList articles={mergedArticles} />}
			{/* Todo: Loading state for this button */}
			{hasNextPage && <Button onClick={() => !isFetching && fetchNextPage()}>Fetch more</Button>}
		</>
	);
}
