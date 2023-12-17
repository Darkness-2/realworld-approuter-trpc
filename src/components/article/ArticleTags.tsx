import CustomTag from "$/components/article/Tag";
import { type Tag } from "$/server/db/schema/article";
import { Flex } from "@chakra-ui/react";

type ArticleTagsProps = {
	tags: Tag[];
};

export default function ArticleTags({ tags }: ArticleTagsProps) {
	return (
		<Flex gap={2} wrap="wrap">
			{tags.map((tag) => (
				// Todo: Make these clickable
				// Should do that by redirecting user to /feed/tag/[text]
				<CustomTag key={tag.id} text={tag.text} />
			))}
		</Flex>
	);
}
