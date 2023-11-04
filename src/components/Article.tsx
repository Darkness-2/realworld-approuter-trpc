import AuthorAndDate from "$/components/AuthorAndDate";
import Link from "$/components/ui/Link";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { Flex, Stack, Tag, Text } from "@chakra-ui/react";

type ArticleProps = {
	article: RouterOutputs["article"]["getGlobalFeed"][number];
};

export default function Article({ article }: ArticleProps) {
	const articleHref = `/article/${article.id}`;

	return (
		<Stack>
			{/* Top row */}
			<Flex
				gap={2}
				flexDirection={{ base: "column", sm: "row" }}
				justifyContent="space-between"
				alignItems={{ base: "normal", sm: "center" }}
			>
				<AuthorAndDate variant="dark" createdAt={article.createdAt} username={article.author.username} />
				<Text>100 Likes</Text>
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
				<Flex gap={2}>
					{article.articlesToTags.map(({ tag }) => (
						// Todo: Make these clickable; should open new tab for the tag
						<Tag key={tag.id} size="sm" variant="solid" colorScheme="gray">
							{tag.text}
						</Tag>
					))}
				</Flex>
			</Flex>
		</Stack>
	);
}
