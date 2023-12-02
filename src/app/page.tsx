import HomePage from "$/components/home/HomePage";

export default function Page() {
	return <HomePage page={1} />;
}

export const revalidate = 300;
