import ArticleTags from "$/components/ArticleTags";
import AuthorAndDate from "$/components/AuthorAndDate";
import LikesTag from "$/components/LikesTag";
import Link from "$/components/ui/Link";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { Flex, Stack, Text } from "@chakra-ui/react";

type ArticleProps = {
	article: RouterOutputs["article"]["getGlobalFeed"][number];
};

export default function Article({ article }: ArticleProps) {
	const articleHref = `/article/${article.id}`;
	const articleTags = article.articlesToTags.map(({ tag }) => tag);

	return (
		<Stack>
			{/* Top row */}
			<Flex
				gap={2}
				// flexDirection={{ base: "column", sm: "row" }}
				justifyContent="space-between"
				alignItems="center"
			>
				<AuthorAndDate variant="dark" createdAt={article.createdAt} username={article.author.username} />
				<LikesTag />
			</Flex>

			{/* Main text content */}
			<Link href={articleHref} _hover={{ textDecoration: "none" }}>
				<Stack>
					<Text fontSize="2xl" fontWeight="semibold">
						{article.title}
					</Text>
					<Text color="gray.500">{article.description}</Text>
				</Stack>
			</Link>

			{/* Bottom row */}
			<Flex
				gap={2}
				flexDirection={{ base: "column", sm: "row" }}
				justifyContent="space-between"
				alignItems={{ base: "normal", sm: "center" }}
			>
				<Link href={articleHref} fontSize="xs" color="gray.500">
					Read more...
				</Link>
				<ArticleTags tags={articleTags} />
			</Flex>
		</Stack>
	);
}
