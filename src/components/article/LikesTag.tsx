"use client";

import { StarIcon } from "@chakra-ui/icons";
import { Tag, TagLeftIcon } from "@chakra-ui/react";

type LikesTagProps = {
	likes: number;
};

export default function LikesTag({ likes }: LikesTagProps) {
	return (
		<Tag colorScheme="green">
			<TagLeftIcon as={StarIcon} />
			{likes} Likes
		</Tag>
	);
}
