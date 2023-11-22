"use client";

import { StarIcon } from "@chakra-ui/icons";
import { Tag, TagLeftIcon } from "@chakra-ui/react";

// Todo: Get real likes counts

export default function LikesTag() {
	return (
		<Tag colorScheme="green">
			<TagLeftIcon as={StarIcon} />
			100 Likes
		</Tag>
	);
}
