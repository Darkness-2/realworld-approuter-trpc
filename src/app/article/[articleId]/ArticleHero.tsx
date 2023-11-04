"use client";

import FollowButton from "$/app/article/[articleId]/FollowButton";
import LikeButton from "$/app/article/[articleId]/LikeButton";
import AuthorAndDate from "$/components/AuthorAndDate";
import { useUser } from "$/lib/hooks/auth";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { Box, Container, Flex, Skeleton, Stack, Text } from "@chakra-ui/react";

type ArticleHeroProps = {
	article: NonNullable<RouterOutputs["article"]["getArticleById"]>;
};

export default function ArticleHero({ article }: ArticleHeroProps) {
	const { user } = useUser();

	return (
		<Box bgColor="gray.800" py={8} shadow="inner">
			<Container maxW="6xl">
				<Stack gap={2}>
					<Text as="h1" fontSize="4xl" color="white" fontWeight="semibold">
						{article.title}
					</Text>
					<Flex flexDirection={{ base: "column", sm: "row" }} alignItems={{ base: "baseline", sm: "center" }} gap={4}>
						<AuthorAndDate variant="light" createdAt={article.createdAt} username={article.author.username} />

						{/* User is loading */}
						{user === undefined && <Skeleton h="24px" w="100px" />}

						{/* User is logged in */}
						{user && (
							<>
								{/* Todo: Change-out follow button for edit button if article is the user's */}
								<FollowButton username={article.author.username} />
								<LikeButton />
							</>
						)}
					</Flex>
				</Stack>
			</Container>
		</Box>
	);
}
