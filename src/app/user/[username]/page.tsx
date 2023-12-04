import InfiniteUserArticleScroll from "$/app/user/[username]/InfiniteUserArticleScroll";
import UserHero from "$/app/user/[username]/UserHero";
import Section from "$/components/ui/Section";
import { getServerClient } from "$/lib/trpc/serverClient";
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
	const initialData = await getServerClient().article.getArticlesByAuthorUsername({
		limit: DEFAULT_PAGE_SIZE,
		username: params.username
	});
	if (!initialData) notFound();

	return (
		<>
			<UserHero user={initialData.author} />
			<Section>
				<Tabs>
					<TabList>
						<Tab>{initialData.author.username}&apos;s articles</Tab>
						<Tab>Liked articles</Tab>
					</TabList>
					<TabPanels>
						<TabPanel px={0}>
							<InfiniteUserArticleScroll
								username={initialData.author.username}
								initialData={initialData}
								// Artificially discount server generation time by 2 seconds to avoid client-server timestamp mismatches
								initialDataTimestamp={new Date().getTime() - 2000}
								pageSize={DEFAULT_PAGE_SIZE}
							/>
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
