import LikedArticlesInfiniteScroll from "$/app/user/[username]/LikedArticlesInfiniteScroll";
import UserArticlesInfiniteScroll from "$/app/user/[username]/UserArticlesInfiniteScroll";
import UserHero from "$/app/user/[username]/UserHero";
import Section from "$/components/ui/Section";
import TRPCHydrate from "$/lib/trpc/TRPCHydrate";
import { getServerTRPCClient } from "$/lib/trpc/serverClient";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { notFound } from "next/navigation";

const DEFAULT_PAGE_SIZE = 10;

type UserPageProps = {
	params: {
		username: string;
	};
};

// Todo: Add not-found boundary

export default async function UserPage({ params }: UserPageProps) {
	const serverClient = getServerTRPCClient();

	const data = await serverClient.article.getArticlesByAuthorUsername.fetchInfinite({
		username: params.username,
		limit: DEFAULT_PAGE_SIZE
	});

	const firstPage = data.pages[0];
	if (!firstPage) notFound();

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
							<TRPCHydrate serverTRPCClient={serverClient}>
								<UserArticlesInfiniteScroll username={firstPage.author.username} pageSize={DEFAULT_PAGE_SIZE} />
							</TRPCHydrate>
						</TabPanel>
						<TabPanel px={0}>
							<LikedArticlesInfiniteScroll userId={firstPage.author.id} pageSize={DEFAULT_PAGE_SIZE} />
						</TabPanel>
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
