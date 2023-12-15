"use client";

import Article from "$/components/article/Article";
import ArticleList from "$/components/article/ArticleList";
import { trpc } from "$/lib/trpc/client";
import { findLastPageNumber, getLimitOffsetForPage } from "$/lib/utils/helpers";
import { notFound } from "next/navigation";

const DEFAULT_PAGE_SIZE = 10;

type HomePageUserFeedProps = {
	page: number;
};

export default function HomePageUserFeed({ page }: HomePageUserFeedProps) {
	// If page is not valid, throw not found
	if (page < 1 || isNaN(page)) notFound();

	const { data, isLoading } = trpc.article.getUserFeed.useQuery(getLimitOffsetForPage(page, DEFAULT_PAGE_SIZE));

	// If viewing a page without any articles, throw not found
	if (data && data.articles.length === 0) notFound();

	return (
		<>
			{/* Display loading state if loading; otherwise show article list */}
			{isLoading && <Article isLoading={true} />}
			{data && (
				<ArticleList
					articles={data.articles}
					paginationOptions={{
						currentPage: page,
						lastPage: findLastPageNumber(data.totalCount, DEFAULT_PAGE_SIZE),
						pathname: "/feed",
						pageParam: "userPage"
					}}
				/>
			)}
		</>
	);
}
