import ArticleHero from "$/app/article/[articleId]/ArticleHero";
import ArticleTags from "$/components/ArticleTags";
import Section from "$/components/ui/Section";
import { getServerClient } from "$/lib/trpc/serverClient";
import { Stack, StackDivider, Text } from "@chakra-ui/react";
import { notFound } from "next/navigation";

type ArticlePageProps = {
	params: {
		articleId: string;
	};
};

// Todo: Add not-found boundary

// Todo: Look into generateStaticParams
// See: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params

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
