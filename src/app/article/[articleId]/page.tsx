import FollowButton from "$/app/article/[articleId]/FollowButton";
import LikeButton from "$/app/article/[articleId]/LikeButton";
import AuthorAndDate from "$/components/AuthorAndDate";
import Section from "$/components/ui/Section";
import { getServerClient } from "$/lib/trpc/serverClient";
import { Box, Container, Flex, Stack, StackDivider, Text } from "@chakra-ui/react";
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

	return (
		<>
			{/* Hero */}
			<Box bgColor="gray.800" py={8} shadow="inner">
				<Container maxW="6xl">
					<Stack gap={2}>
						<Text as="h1" fontSize="4xl" color="white" fontWeight="semibold">
							{article.title}
						</Text>
						<Flex flexDirection={{ base: "column", sm: "row" }} alignItems={{ base: "baseline", sm: "center" }} gap={4}>
							<AuthorAndDate variant="light" createdAt={article.createdAt} username={article.author.username} />
							{/* Todo: Change-out follow button for edit button if article is the user's */}
							<FollowButton username={article.author.username} />
							<LikeButton />
						</Flex>
					</Stack>
				</Container>
			</Box>
			<Section>
				<Stack divider={<StackDivider />} gap={4}>
					<Text>{article.body}</Text>
					<Text>Todo: Add comments</Text>
				</Stack>
			</Section>
		</>
	);
}

// Todo: Add revalidate
