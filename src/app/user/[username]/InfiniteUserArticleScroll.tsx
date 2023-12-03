"use client";

import ArticleList from "$/components/article/ArticleList";
import { trpc } from "$/lib/trpc/client";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { Button } from "@chakra-ui/react";
import { type ComponentProps } from "react";

const DEFAULT_PAGE_SIZE = 10;

type InfiniteArticleScrollProps = {
	username: string;
	initialData: RouterOutputs["article"]["getArticlesByAuthorUsername"];
};

export default function InfiniteUserArticleScroll({ username, initialData }: InfiniteArticleScrollProps) {
	const { data, hasNextPage, fetchNextPage } = trpc.article.getArticlesByAuthorUsername.useInfiniteQuery(
		{ username, limit: DEFAULT_PAGE_SIZE },
		{
			initialData: {
				pages: [initialData],
				pageParams: []
			},
			// Todo: Probably want to configure this to not refetch every page again when revisiting the page
			getNextPageParam: (lastPage) => {
				// Shouldn't theoretically happen as at this point we know the username exists
				if (!lastPage) return undefined;

				// If last page already wasn't full, no more pages exist
				if (lastPage.articles.length < DEFAULT_PAGE_SIZE) return undefined;

				// Todo: Test this the user has a number of articles divisible by 10
				// Probably better to return a hasMore from the tRPC procedure

				// Todo: Just have the procedure itself return the nextCursor as well?

				const lastArticle = lastPage.articles.slice(-1);
				return lastArticle?.[0]?.createdAt;
			}
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
			{hasNextPage && <Button onClick={() => fetchNextPage()}>Fetch more</Button>}
		</>
	);
}
