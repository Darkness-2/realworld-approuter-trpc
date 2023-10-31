import HomePageHero from "$/components/HomePageHero";
import HomePageTabs from "$/components/HomePageTabs";
import { Container } from "@chakra-ui/react";

export default function Home() {
	return (
		<>
			<HomePageHero />
			<Container maxW="6xl" mt={8}>
				<HomePageTabs />
			</Container>
		</>
	);
}
