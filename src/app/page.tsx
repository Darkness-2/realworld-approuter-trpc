import HomePageHero from "$/components/home/HomePageHero";
import HomePageTabs from "$/components/home/HomePageTabs";
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
