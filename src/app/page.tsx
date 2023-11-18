import HomePageGlobalFeed from "$/components/home/HomePageGlobalFeed";
import HomePageHero from "$/components/home/HomePageHero";
import Section from "$/components/ui/Section";
import { type SearchParams } from "$/lib/utils/helpers";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

type HomePageProps = {
	searchParams: SearchParams;
};

export default function Home({ searchParams }: HomePageProps) {
	const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) || 1 : 1;

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
							<HomePageGlobalFeed page={page} />
						</TabPanel>
						<TabPanel px={0}>Todo: Put in user&apos;s feed</TabPanel>
					</TabPanels>
				</Tabs>
			</Section>
		</>
	);
}

// Todo: Look into if it is possible to cache this page again now that it is using searchParams
