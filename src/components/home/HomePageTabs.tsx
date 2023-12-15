"use client";

import { useUser } from "$/lib/hooks/auth";
import { Skeleton, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";

type Tab = {
	label: string;
	link?: string | undefined;
	requiresAuth: boolean;
	panel: ReactNode;
};

type HomePageTabsProps = {
	activeTab: "globalFeed" | "userFeed";
	tabs: Tab[];
};

// Todo: Open tab based on which page param is set

export default function HomePageTabs({ tabs, activeTab }: HomePageTabsProps) {
	const activeTabIndex = activeTab === "globalFeed" ? 0 : 1;

	return (
		// Lock user on the active tab for the page
		<Tabs index={activeTabIndex}>
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

function CustomTab({ tab: { label, requiresAuth, link } }: TabAsProp) {
	const { user, isLoading } = useUser();
	const router = useRouter();

	// Don't add the tab if it requiresAuth and there is no user
	if (requiresAuth && user === null) return null;

	// If tab is a link, push user there
	const handleClick = () => {
		if (link) router.push(link);
	};

	return (
		<Tab onClick={handleClick}>
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
