import HomePage from "$/components/home/HomePage";

export default function Home() {
	return <HomePage page={1} />;
}

export const revalidate = 300;
