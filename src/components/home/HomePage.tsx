import HomePageGlobalFeed from "$/components/home/HomePageGlobalFeed";
import HomePageHero from "$/components/home/HomePageHero";
import Section from "$/components/ui/Section";

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

type HomePageProps = {
	page: number;
};

export default function HomePage({ page }: HomePageProps) {
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
