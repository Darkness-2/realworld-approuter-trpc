import HomePage from "$/components/home/HomePage";
import { type SearchParams } from "$/lib/utils/helpers";

type FeedPageProps = {
	searchParams: SearchParams;
};

/**
 * This page is a copy of the home page that is dynamically rendered so it can take advantage of searchParams
 */
export default function FeedPage({ searchParams: { page } }: FeedPageProps) {
	const pageNumber = typeof page === "string" ? parseInt(page) : 1;

	return <HomePage page={pageNumber} />;
}

/** Using searchParams makes this page dynamically rendered
 * Todo: Look into unstable_cache for this
 */
