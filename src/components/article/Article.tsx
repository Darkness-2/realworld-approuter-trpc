import ArticleTags from "$/components/article/ArticleTags";
import AuthorAndDate from "$/components/article/AuthorAndDate";
import LikesTag from "$/components/like/LikesTag";
import Link from "$/components/ui/Link";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { Flex, Skeleton, Stack, Text } from "@chakra-ui/react";

type Article = RouterOutputs["article"]["getGlobalFeed"]["articles"][number];

type ArticleProps =
	| {
			article: Article;
			isLoading?: false;
	  }
	| {
			article?: undefined;
			isLoading: true;
	  };

// Used if Article is in loading state
const mockData: Article = {
	likesCount: 0,
	articlesToTags: [{ tag: { id: "abc", text: "abc" } }],
	author: {
		username: "abc"
	},
	authorId: "abc",
	createdAt: new Date(),
	description: "abc",
	id: "abc",
	title: "abc"
};

export default function Article({ article = mockData, isLoading = false }: ArticleProps) {
	const articleHref = `/article/${article.id}`;
	const articleTags = article.articlesToTags.map(({ tag }) => tag);

	return (
		<Stack>
			{/* Top row */}

			<Flex gap={2} justifyContent="space-between" alignItems="center">
				<Skeleton isLoaded={!isLoading}>
					<AuthorAndDate variant="dark" createdAt={article.createdAt} username={article.author.username} />
				</Skeleton>
				<Skeleton isLoaded={!isLoading}>
					<LikesTag likes={article.likesCount} />
				</Skeleton>
			</Flex>

			{/* Main text content */}
			<Link href={articleHref} _hover={{ textDecoration: "none" }}>
				<Stack>
					{/* Todo: Replace other skeletons with this approach */}
					<Skeleton isLoaded={!isLoading}>
						<Text fontSize="2xl" fontWeight="semibold">
							{article.title}
						</Text>
					</Skeleton>
					<Skeleton isLoaded={!isLoading}>
						<Text color="gray.500">{article.description}</Text>
					</Skeleton>
				</Stack>
			</Link>

			{/* Bottom row */}
			<Skeleton isLoaded={!isLoading}>
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
			</Skeleton>
		</Stack>
	);
}
