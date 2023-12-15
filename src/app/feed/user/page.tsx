import HomePage from "$/components/home/HomePage";
import { convertSearchParamToInt, type SearchParams } from "$/lib/utils/helpers";

type UserFeedPageProps = {
	searchParams: SearchParams;
};

export default function UserFeedPage({ searchParams: { userPage } }: UserFeedPageProps) {
	const pageNumber = convertSearchParamToInt(userPage);

	return <HomePage activeTab="userFeed" userFeedPageNumber={pageNumber} />;
}

/**
 * Using searchParams makes this page dynamically rendered
 * Todo: Look into unstable_cache for this
 */
