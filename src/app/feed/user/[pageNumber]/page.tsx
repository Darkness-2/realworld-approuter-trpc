import HomePage from "$/components/home/HomePage";
import { convertSearchParamToInt } from "$/lib/utils/helpers";

type UserFeedPageProps = {
	params: {
		pageNumber: string;
	};
};

export default function UserFeedPage({ params }: UserFeedPageProps) {
	const pageNumber = convertSearchParamToInt(params.pageNumber);

	return <HomePage activeTab="userFeed" userFeedPageNumber={pageNumber} />;
}

export const revalidate = 300;
