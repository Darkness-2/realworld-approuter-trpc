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

export const revalidate = 300;
