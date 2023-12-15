import HomePageGlobalFeed from "$/components/home/HomePageGlobalFeed";
import HomePageHero from "$/components/home/HomePageHero";
import HomePageTabs from "$/components/home/HomePageTabs";
import HomePageUserFeed from "$/components/home/HomePageUserFeed";
import Section from "$/components/ui/Section";
import { type ComponentProps } from "react";

type HomePageProps = {
	globalFeedPageNumber: number;
	userFeedPageNumber: number;
};

export default function HomePage({ globalFeedPageNumber, userFeedPageNumber }: HomePageProps) {
	const tabs: ComponentProps<typeof HomePageTabs>["tabs"] = [
		{
			label: "Global feed",
			panel: <HomePageGlobalFeed page={globalFeedPageNumber} />,
			requiresAuth: false
		},
		{
			label: "Your feed",
			panel: <HomePageUserFeed page={userFeedPageNumber} />,
			requiresAuth: true
		}
	];

	return (
		<>
			<HomePageHero />
			<Section>
				<HomePageTabs tabs={tabs} />
			</Section>
		</>
	);
}
