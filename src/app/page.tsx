import HomePageHero from "$/components/HomePageHero";
import HomePageTabs from "$/components/HomePageTabs";
import Section from "$/components/ui/Section";
import { Container } from "@chakra-ui/react";

export default function Home() {
	return (
		<>
			<HomePageHero />
			<Section>
				<Container maxW="6xl">
					<HomePageTabs />
				</Container>
			</Section>
		</>
	);
}

/**
 * Regenerate only every 5 minutes.
 */
export const revalidate = 300;
