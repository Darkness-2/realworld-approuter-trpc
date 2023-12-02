import HomePageGlobalFeed from "$/components/home/HomePageGlobalFeed";
import HomePageHero from "$/components/home/HomePageHero";
import Section from "$/components/ui/Section";
import { type SearchParams } from "$/lib/utils/helpers";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

type HomePageProps = {
	searchParams: SearchParams;
};

export default function HomePage({ searchParams: { page } }: HomePageProps) {
	const pageNumber = typeof page === "string" ? parseInt(page) : 1;

	return (
		<>
			<HomePageHero />
			<Section>
				<Tabs>
					<TabList>
						<Tab>Global feed</Tab>
						<Tab>Your feed</Tab>
					</TabList>
					<TabPanels>
						<TabPanel px={0}>
							<HomePageGlobalFeed page={pageNumber} />
						</TabPanel>
						<TabPanel px={0}>Todo: Put in user&apos;s feed</TabPanel>
					</TabPanels>
				</Tabs>
			</Section>
		</>
	);
}

/**  Todo: Using searchParams currently doesn't support static rendering
 * Possible solutions: wait for unstable_cache to become stable or
 * extract paginated stuff into separate page so that home page can still be static.
 */

// export const revalidate = 300;
