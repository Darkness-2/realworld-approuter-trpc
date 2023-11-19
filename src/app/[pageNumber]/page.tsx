import HomePage from "$/components/home/HomePage";

type HomePagePaginatedProps = {
	params: {
		pageNumber: string;
	};
};

export default function HomePagePaginated({ params: { pageNumber } }: HomePagePaginatedProps) {
	const page = parseInt(pageNumber) || 1;

	return <HomePage page={page} />;
}

/**
 * Force page to be static and regenerated every 5 minutes.
 */
export const dynamic = "error";
export const revalidate = 300;

// Todo: Consider removing this page and implemeneting the page functionality client-side with tRPC
