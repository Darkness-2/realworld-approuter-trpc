import HomePage from "$/components/home/HomePage";

export default function Page() {
	return <HomePage globalFeedPageNumber={1} userFeedPageNumber={1} />;
}

export const revalidate = 300;
