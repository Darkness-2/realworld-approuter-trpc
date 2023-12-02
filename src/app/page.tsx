import HomePageGlobalFeedLoader from "$/components/home/HomePageGlobalFeedLoader";
import HomePageHero from "$/components/home/HomePageHero";
import Section from "$/components/ui/Section";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

export default function Home() {
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
							<HomePageGlobalFeedLoader />
						</TabPanel>
						<TabPanel px={0}>Todo: Put in user&apos;s feed</TabPanel>
					</TabPanels>
				</Tabs>
			</Section>
		</>
	);
}

export const revalidate = 300;
