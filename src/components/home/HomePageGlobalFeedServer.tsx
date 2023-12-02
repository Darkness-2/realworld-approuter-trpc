import ArticleList from "$/components/article/ArticleList";
import { getServerClient } from "$/lib/trpc/serverClient";
import { findLastPageNumber, getLimitOffsetForPage } from "$/lib/utils/helpers";
import dynamic from "next/dynamic";

const DEFAULT_PAGE_SIZE = 10;

const HomePageGlobalFeedClient = dynamic(() => import("$/components/home/HomePageGlobalFeedClient"), {
	ssr: false
});

/**
 * This component loads page 1 of the global feed so that the feed can be server-side rendered
 */
export default async function HomePageGlobalFeedServer() {
	const page = 1;

	const initialData = await getServerClient().article.getGlobalFeed(getLimitOffsetForPage(page, DEFAULT_PAGE_SIZE));

	return (
		<>
			{/* Loads the page one data when rendered on server; otherwise loads the actual client component.
			 *  Required as the client component uses useSearchParams which defers loading to client-side.
			 */}
			{typeof window !== "undefined" ? (
				<HomePageGlobalFeedClient initialData={initialData} pageSize={DEFAULT_PAGE_SIZE} />
			) : (
				<ArticleList
					articles={initialData.articles}
					paginationOptions={{
						currentPage: page,
						lastPage: findLastPageNumber(initialData.totalCount, DEFAULT_PAGE_SIZE)
					}}
				/>
			)}
		</>
	);
}
