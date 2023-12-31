import ArticleList from "$/components/article/ArticleList";
import { getServerTRPCClient } from "$/lib/trpc/serverClient";
import { findLastPageNumber, getLimitOffsetForPage } from "$/lib/utils/helpers";
import { notFound } from "next/navigation";

const DEFAULT_PAGE_SIZE = 10;

type HomePageGlobalFeedProps = {
	page: number;
};

export default async function HomePageGlobalFeed({ page }: HomePageGlobalFeedProps) {
	// If page is not valid, throw not found
	if (page < 1 || isNaN(page)) notFound();

	const { articles, totalCount } = await getServerTRPCClient().article.getGlobalFeed.fetch(
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
				pathname: "/feed/global",
				method: "pageParam"
			}}
		/>
	);
}
