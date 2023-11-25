import { type Tag } from "$/server/db/schema/article";
import { Tag as ChakraTag, Flex } from "@chakra-ui/react";

type ArticleTagsProps = {
	tags: Tag[];
};

export default function ArticleTags({ tags }: ArticleTagsProps) {
	return (
		<Flex gap={2} wrap="wrap">
			{tags.map((tag) => (
				// Todo: Make these clickable; should open new tab for the tag
				// Should do that by redirecting user to homepage with ?tab=""
				<ChakraTag key={tag.id} size="sm" variant="solid" colorScheme="gray">
					{tag.text}
				</ChakraTag>
			))}
		</Flex>
	);
}
