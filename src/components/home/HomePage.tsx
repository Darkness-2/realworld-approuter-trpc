import HomePageGlobalFeed from "$/components/home/HomePageGlobalFeed";
import HomePageHero from "$/components/home/HomePageHero";
import HomePageTabs from "$/components/home/HomePageTabs";
import Section from "$/components/ui/Section";
import { type ComponentProps } from "react";

type HomePageProps = {
	page: number;
};

export default function HomePage({ page }: HomePageProps) {
	const tabs: ComponentProps<typeof HomePageTabs>["tabs"] = [
		{
			label: "Global feed",
			panel: <HomePageGlobalFeed page={page} />,
			requiresAuth: false
		},
		{
			label: "Your feed",
			panel: "TBD",
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
