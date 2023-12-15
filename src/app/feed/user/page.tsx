import HomePage from "$/components/home/HomePage";
import { convertSearchParamToInt, type SearchParams } from "$/lib/utils/helpers";

type UserFeedPageProps = {
	searchParams: SearchParams;
};

// Todo: Instead of using searchParams server-side, could be client-side so it can be statically rendered
// Or: Convert this page and global feed page to use page param instead of search param

export default function UserFeedPage({ searchParams: { userPage } }: UserFeedPageProps) {
	const pageNumber = convertSearchParamToInt(userPage);

	return <HomePage activeTab="userFeed" userFeedPageNumber={pageNumber} />;
}

/**
 * Using searchParams makes this page dynamically rendered
 * Todo: Look into unstable_cache for this
 */
