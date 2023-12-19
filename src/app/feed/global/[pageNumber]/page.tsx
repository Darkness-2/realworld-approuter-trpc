import HomePage from "$/components/home/HomePage";
import { convertSearchParamToInt } from "$/lib/utils/helpers";

type GlobalFeedPageProps = {
	params: {
		pageNumber: string;
	};
};

/**
 * This page is a copy of the home page that is dynamically rendered so it can take advantage of searchParams
 */
export default function GlobalFeedPage({ params }: GlobalFeedPageProps) {
	const pageNumber = convertSearchParamToInt(params.pageNumber);

	return <HomePage activeTab="globalFeed" globalFeedPageNumber={pageNumber} />;
}

/**
 * Force page to be static and regenerated every 5 minutes.
 */
export const dynamic = "error";
export const revalidate = 300;
