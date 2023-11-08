"use client";

import { StarIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

// Todo: Put real likes count
// Todo: Make button like the article

export default function LikeButton() {
	return (
		<Button size="xs" variant="solid" colorScheme="green" leftIcon={<StarIcon />}>
			Like Article (100)
		</Button>
	);
}
