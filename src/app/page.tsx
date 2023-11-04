import HomePageHero from "$/components/HomePageHero";
import HomePageTabs from "$/components/HomePageTabs";
import Section from "$/components/ui/Section";

export default function Home() {
	return (
		<>
			<HomePageHero />
			<Section>
				<HomePageTabs />
			</Section>
		</>
	);
}

/**
 * Regenerate every 5 minutes.
 */
export const revalidate = 300;
