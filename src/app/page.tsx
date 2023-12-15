import HomePage from "$/components/home/HomePage";

export default function Page() {
	return <HomePage activeTab="globalFeed" globalFeedPageNumber={1} />;
}

export const revalidate = 300;
