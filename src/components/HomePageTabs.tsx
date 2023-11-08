import HomeGlobalFeed from "$/components/HomePageGlobalFeed";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

export default function HomePageTabs() {
	return (
		<Tabs>
			<TabList>
				<Tab>Global feed</Tab>
				<Tab>Your feed</Tab>
			</TabList>
			<TabPanels>
				<TabPanel px={0}>
					<HomeGlobalFeed />
				</TabPanel>
				<TabPanel px={0}>Todo: Put in user&apos;s feed</TabPanel>
			</TabPanels>
		</Tabs>
	);
}
