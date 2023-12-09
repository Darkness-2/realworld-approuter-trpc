import InfiniteUserArticleScroll from "$/app/user/[username]/InfiniteUserArticleScroll";
import UserHero from "$/app/user/[username]/UserHero";
import Section from "$/components/ui/Section";
import { getServerSideHelpers } from "$/lib/trpc/serverClient";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";

const DEFAULT_PAGE_SIZE = 10;

type UserPageProps = {
	params: {
		username: string;
	};
};

// Todo: Add not-found boundary

export default async function UserPage({ params }: UserPageProps) {
	const helpers = getServerSideHelpers();

	const data = await helpers.article.getArticlesByAuthorUsername.fetchInfinite({
		username: params.username,
		limit: DEFAULT_PAGE_SIZE
	});

	const firstPage = data.pages[0];
	if (!firstPage) notFound();

	const dehydratedState = dehydrate(helpers.queryClient);

	return (
		<>
			<UserHero user={firstPage.author} />
			<Section>
				<Tabs>
					<TabList>
						<Tab>{firstPage.author.username}&apos;s articles</Tab>
						<Tab>Liked articles</Tab>
					</TabList>
					<TabPanels>
						<TabPanel px={0}>
							{/* Todo: Could create custom hydrate that takes in tRPC helpers */}
							<Hydrate state={dehydratedState}>
								<InfiniteUserArticleScroll username={firstPage.author.username} pageSize={DEFAULT_PAGE_SIZE} />
							</Hydrate>
						</TabPanel>
						<TabPanel px={0}>Todo: Enter user&apos;s liked articles</TabPanel>
					</TabPanels>
				</Tabs>
			</Section>
		</>
	);
}

/**
 * Force page to be static and regenerated every 5 minutes.
 */
export const dynamic = "error";
export const revalidate = 300;
