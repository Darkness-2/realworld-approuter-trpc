import Link from "$/components/ui/Link";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { Flex, Stack, Text } from "@chakra-ui/react";

type ArticleProps = {
	article: RouterOutputs["article"]["getGlobalFeed"][number];
};

export default function Article({ article }: ArticleProps) {
	const articleHref = `/articles/${article.id}`;

	return (
		<Stack>
			{/* Top row */}
			<Flex
				gap={2}
				flexDirection={{ base: "column", sm: "row" }}
				justifyContent="space-between"
				alignItems={{ base: "normal", sm: "center" }}
			>
				<Stack gap={0}>
					<Link href={`/@${article.author.username}`} textColor="green.500" fontWeight="medium">
						@{article.author.username}
					</Link>
					<Text fontSize="xs" color="gray.500">
						{article.createdAt.toLocaleDateString("en-CA", {
							dateStyle: "long"
						})}
					</Text>
				</Stack>
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
						// Todo: Put into tag styling and make clickable
						<Text key={tag.id}>{tag.text}</Text>
					))}
				</Flex>
			</Flex>
		</Stack>
	);
}
