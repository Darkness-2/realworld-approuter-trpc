import HomePageGlobalFeed from "$/components/home/HomePageGlobalFeed";
import HomePageHero from "$/components/home/HomePageHero";
import HomePageTabs from "$/components/home/HomePageTabs";
import HomePageUserFeed from "$/components/home/HomePageUserFeed";
import Section from "$/components/ui/Section";
import { type ComponentProps } from "react";

type HomePageProps =
	| {
			activeTab: "globalFeed";
			globalFeedPageNumber: number;
			userFeedPageNumber?: undefined;
	  }
	| {
			activeTab: "userFeed";
			globalFeedPageNumber?: undefined;
			userFeedPageNumber: number;
	  };

export default function HomePage({ globalFeedPageNumber, userFeedPageNumber, activeTab }: HomePageProps) {
	const globalFeed = activeTab === "globalFeed" ? <HomePageGlobalFeed page={globalFeedPageNumber} /> : null;
	const userFeed = activeTab === "userFeed" ? <HomePageUserFeed page={userFeedPageNumber} /> : null;

	const tabs: ComponentProps<typeof HomePageTabs>["tabs"] = [
		{
			label: "Global feed",
			panel: globalFeed,
			requiresAuth: false,
			link: globalFeed ? undefined : "/feed/global"
		},
		{
			label: "Your feed",
			panel: userFeed,
			requiresAuth: true,
			link: userFeed ? undefined : "/feed/user"
		}
	];

	return (
		<>
			<HomePageHero />
			<Section>
				<HomePageTabs tabs={tabs} activeTab={activeTab} />
			</Section>
		</>
	);
}
