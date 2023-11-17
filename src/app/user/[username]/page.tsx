import UserHero from "$/app/user/[username]/UserHero";
import Article from "$/components/Article";
import Section from "$/components/ui/Section";
import { getServerClient } from "$/lib/trpc/serverClient";
import { Stack, StackDivider, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { notFound } from "next/navigation";
import { type ComponentProps } from "react";

type UserPageProps = {
	params: {
		username: string;
	};
};

// Todo: Add not-found boundary

export default async function UserPage({ params }: UserPageProps) {
	const userArticles = await getServerClient().article.getArticlesByAuthorUsername({ username: params.username });
	if (!userArticles) notFound();

	const { author } = userArticles;

	// Re-attach author context as expected for article type
	const articles: ComponentProps<typeof Article>["article"][] = userArticles.articles.map((article) => ({
		...article,
		author: {
			username: userArticles.author.username
		}
	}));

	return (
		<>
			<UserHero user={author} />
			<Section>
				<Tabs>
					<TabList>
						<Tab>{author.username}&apos;s articles</Tab>
						<Tab>Favorited articles</Tab>
					</TabList>
					<TabPanels>
						<TabPanel px={0}>
							<Stack gap={2} divider={<StackDivider />}>
								{articles.map((article) => (
									<Article key={article.id} article={article} />
								))}
							</Stack>
						</TabPanel>
						<TabPanel px={0}>Todo: Enter user favorited articles</TabPanel>
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
