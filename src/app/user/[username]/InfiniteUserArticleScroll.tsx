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
	const infiniteQuery = trpc.article.getArticlesByAuthorUsername.useInfiniteQuery(
		{ username, limit: DEFAULT_PAGE_SIZE },
		{
			initialData: {
				pages: [initialData],
				pageParams: []
			},
			getNextPageParam: (lastPage) => {
				const lastArticle = lastPage?.articles.slice(-1);
				return lastArticle?.[0]?.createdAt;
			}
		}
	);

	console.log(infiniteQuery.data);

	// Merge articles from the pages together and format for the ArticleList component
	// Todo: Does tanstack not cover this automatically?
	const mergedArticles: ComponentProps<typeof ArticleList>["articles"] | undefined = infiniteQuery.data?.pages.flatMap(
		(page) => {
			if (!page) return [];

			// Add author information back into the articles
			const articles = page.articles.map((article) => ({ ...article, author: { username } }));
			return [...articles];
		}
	);

	return (
		<>
			{/* Todo: Add loading state */}
			{mergedArticles && <ArticleList articles={mergedArticles} />}
			{/* Todo: Loading state for this button */}
			<Button onClick={() => infiniteQuery.fetchNextPage()}>Fetch more</Button>
		</>
	);
}
