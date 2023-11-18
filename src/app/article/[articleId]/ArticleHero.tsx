"use client";

import AuthorAndDate from "$/components/AuthorAndDate";
import FollowButton from "$/components/FollowButton";
import LikeButton from "$/components/LikeButton";
import { useUser } from "$/lib/hooks/auth";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { EditIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Flex, Skeleton, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";

type ArticleHeroProps = {
	article: NonNullable<RouterOutputs["article"]["getArticleById"]>;
};

export default function ArticleHero({ article }: ArticleHeroProps) {
	const { user, isLoading } = useUser();

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
						{isLoading && <Skeleton h="24px" w="100px" />}

						{/* User is logged in */}
						{user && (
							<>
								{/* Show edit button if article is the user's; otherwise show follow button */}
								{user.userId === article.authorId && (
									<Button
										as={Link}
										href={`/edit/${article.id}`}
										size="xs"
										variant="solid"
										colorScheme="gray"
										leftIcon={<EditIcon />}
									>
										Edit article
									</Button>
								)}
								{user.userId !== article.authorId && <FollowButton username={article.author.username} />}
								<LikeButton />
							</>
						)}
					</Flex>
				</Stack>
			</Container>
		</Box>
	);
}
