import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

export default function HomePageTabs() {
	return (
		<Tabs>
			<TabList>
				<Tab>Global feed</Tab>
				<Tab>Your feed</Tab>
			</TabList>
			<TabPanels>
				<TabPanel>Some content</TabPanel>
				<TabPanel>Some other content</TabPanel>
			</TabPanels>
		</Tabs>
	);
}
