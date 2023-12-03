import ArticleList from "$/components/article/ArticleList";
import { getServerClient } from "$/lib/trpc/serverClient";
import { findLastPageNumber, getLimitOffsetForPage } from "$/lib/utils/helpers";
import { notFound } from "next/navigation";

// Todo: Explore wrapping this in suspense boundary or loading.js?

const DEFAULT_PAGE_SIZE = 10;

type HomePageGlobalFeedProps = {
	page: number;
};

export default async function HomePageGlobalFeed({ page }: HomePageGlobalFeedProps) {
	// If page is not valid, throw not found
	if (page < 1 || isNaN(page)) notFound();

	const { articles, totalCount } = await getServerClient().article.getGlobalFeed(
		getLimitOffsetForPage(page, DEFAULT_PAGE_SIZE)
	);

	// If viewing a page without any articles, throw not found
	if (articles.length === 0) notFound();

	return (
		<ArticleList
			articles={articles}
			paginationOptions={{
				currentPage: page,
				lastPage: findLastPageNumber(totalCount, DEFAULT_PAGE_SIZE),
				pathname: "/feed"
			}}
		/>
	);
}
