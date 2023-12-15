"use client";

import { useUser } from "$/lib/hooks/auth";
import { Skeleton, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { type ReactNode } from "react";

type Tab = {
	label: string;
	requiresAuth: boolean;
	panel: ReactNode;
};

type HomePageTabsProps = {
	tabs: Tab[];
};

export default function HomePageTabs({ tabs }: HomePageTabsProps) {
	return (
		<Tabs>
			<TabList>
				{tabs.map((tab) => (
					<CustomTab key={tab.label} tab={tab} />
				))}
			</TabList>
			<TabPanels>
				{tabs.map((tab) => (
					<CustomTabPanel key={tab.label} tab={tab} />
				))}
			</TabPanels>
		</Tabs>
	);
}

type TabAsProp = {
	tab: Tab;
};

function CustomTab({ tab: { label, requiresAuth } }: TabAsProp) {
	const { user, isLoading } = useUser();

	// Don't add the tab if it requiresAuth and there is no user
	if (requiresAuth && user === null) return null;

	return (
		<Tab>
			{/* Display loading state if it requires auth and isLoading */}
			<Skeleton isLoaded={!(requiresAuth && isLoading)}>{label}</Skeleton>
		</Tab>
	);
}

function CustomTabPanel({ tab: { panel, requiresAuth } }: TabAsProp) {
	const { user } = useUser();

	// Don't add the panel if it requiresAuth and there is no user
	if (requiresAuth && user === null) return null;

	return <TabPanel px={0}>{panel}</TabPanel>;
}
