import ArticleHero from "$/app/article/[articleId]/ArticleHero";
import ArticleTags from "$/components/ArticleTags";
import Section from "$/components/ui/Section";
import { getServerClient } from "$/lib/trpc/serverClient";
import { db } from "$/server/db";
import { Stack, StackDivider, Text } from "@chakra-ui/react";
import { notFound } from "next/navigation";

type ArticlePageProps = {
	params: {
		articleId: string;
	};
};

// Todo: Add not-found boundary

export default async function ArticlePage({ params }: ArticlePageProps) {
	const article = await getServerClient().article.getArticleById(params.articleId);
	if (!article) notFound();

	const articleTags = article.articlesToTags.map(({ tag }) => tag);

	return (
		<>
			{/* Hero */}
			<ArticleHero article={article} />
			{/* Main section */}
			<Section>
				<Stack divider={<StackDivider />} gap={4}>
					<Text>{article.body}</Text>
					<ArticleTags tags={articleTags} />
					<Text>Todo: Add comments</Text>
				</Stack>
			</Section>
		</>
	);
}

/**
 * Regenerate every 5 minutes.
 */
export const revalidate = 300;

/**
 * Will generate the page at build time for the 100 most recent articles.
 */
export const generateStaticParams = async (): Promise<ArticlePageProps["params"][]> => {
	const articleIds = await db.query.article.findMany({
		columns: { id: true },
		limit: 100,
		orderBy: ({ createdAt }, { desc }) => desc(createdAt)
	});

	return articleIds.map(({ id }) => ({ articleId: id }));
};
