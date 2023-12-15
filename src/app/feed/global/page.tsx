import HomePage from "$/components/home/HomePage";
import { convertSearchParamToInt, type SearchParams } from "$/lib/utils/helpers";

type GlobalFeedPageProps = {
	searchParams: SearchParams;
};

/**
 * This page is a copy of the home page that is dynamically rendered so it can take advantage of searchParams
 */
export default function GlobalFeedPage({ searchParams: { page } }: GlobalFeedPageProps) {
	const pageNumber = convertSearchParamToInt(page);

	return <HomePage activeTab="globalFeed" globalFeedPageNumber={pageNumber} />;
}

/**
 * Using searchParams makes this page dynamically rendered
 * Todo: Look into unstable_cache for this
 */
