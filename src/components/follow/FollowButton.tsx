"use client";

import { useFollows } from "$/lib/hooks/follow";
import { trpc } from "$/lib/trpc/client";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Button, useToast } from "@chakra-ui/react";

type FollowButtonProps = {
	authorId: string;
	username: string;
};

export default function FollowButton({ authorId, username }: FollowButtonProps) {
	const utils = trpc.useUtils();
	const toast = useToast();
	const { authorsFollowing, isLoading } = useFollows();

	const follow = trpc.follow.follow.useMutation({
		onSuccess: () => {
			toast({
				title: `Followed @${username}`,
				description: `Successfully followed @${username}`,
				status: "success",
				isClosable: true
			});
		},
		onError: (e) => {
			// Something unexpected happened
			toast({
				title: "Something went wrong",
				description: `Unable to follow @${username}`,
				status: "error",
				isClosable: true
			});

			console.error(e);
		},
		onSettled: () => {
			// Invalidate follows queries
			utils.follow.invalidate();
		}
	});

	const unfollow = trpc.follow.unfollow.useMutation({
		onSuccess: () => {
			toast({
				title: `Unfollowed @${username}`,
				description: `Successfully unfollowed @${username}`,
				status: "success",
				isClosable: true
			});
		},
		onError: (e) => {
			// Something unexpected happened
			toast({
				title: "Something went wrong",
				description: `Unable to unfollow @${username}`,
				status: "error",
				isClosable: true
			});

			console.error(e);
		},
		onSettled: () => {
			// Invalidate follows queries
			utils.follow.invalidate();
		}
	});

	// Determine if user is following this author
	const isFollowing = authorsFollowing && authorsFollowing.some((f) => f.authorId === authorId);

	// Todo: Look into optimistic update for this

	const handleClick = () => {
		if (isFollowing) unfollow.mutate(authorId);
		if (!isFollowing) follow.mutate(authorId);
	};

	return (
		<Button
			isLoading={isLoading || follow.isLoading || unfollow.isLoading}
			size="xs"
			variant="solid"
			// Show as gray while loading or if user is following
			colorScheme={isFollowing || isLoading ? "gray" : "green"}
			leftIcon={isFollowing ? <ViewOffIcon /> : <ViewIcon />}
			onClick={handleClick}
		>
			{isFollowing ? "Unfollow" : "Follow"} @{username}
		</Button>
	);
}
