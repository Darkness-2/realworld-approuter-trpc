"use client";

import { ViewIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

type FollowButtonProps = {
	username: string;
};

// Todo: Make button follow / unfollow author

export default function FollowButton({ username }: FollowButtonProps) {
	return (
		<Button size="xs" variant="solid" colorScheme="gray" leftIcon={<ViewIcon />}>
			Follow @{username}
		</Button>
	);
}
