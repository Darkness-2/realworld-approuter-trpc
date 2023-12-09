"use client";

import { useFollows } from "$/lib/hooks/follow";
import { trpc } from "$/lib/trpc/client";
import { type RouterOutputs } from "$/lib/trpc/shared";
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
		onMutate: async (authorId) => {
			// Cancel anything outgoing so it doesn't override
			await utils.follow.getAuthorsFollowing.cancel(undefined);

			// Snapshot the previous value and create new one
			const previousFollows = utils.follow.getAuthorsFollowing.getData(undefined);
			const newFollow: RouterOutputs["follow"]["getAuthorsFollowing"][number] = {
				authorId
			};

			// Update follows query with the optimistic data
			utils.follow.getAuthorsFollowing.setData(undefined, (old) => (old ? [...old, newFollow] : [newFollow]));

			return { previousFollows };
		},
		onSuccess: () => {
			toast({
				title: `Followed @${username}`,
				description: `Successfully followed @${username}`,
				status: "success",
				isClosable: true
			});
		},
		onError: (e, _, context) => {
			// Something unexpected happened
			toast({
				title: "Something went wrong",
				description: `Unable to follow @${username}`,
				status: "error",
				isClosable: true
			});

			// Reset the optimistic update
			utils.follow.getAuthorsFollowing.setData(undefined, context?.previousFollows);

			console.error(e);
		},
		onSettled: () => {
			// Invalidate follows queries
			utils.follow.invalidate();
		}
	});

	const unfollow = trpc.follow.unfollow.useMutation({
		onMutate: async (authorId) => {
			// Cancel anything outgoing so it doesn't override
			await utils.follow.getAuthorsFollowing.cancel(undefined);

			// Snapshot the previous value
			const previousFollows = utils.follow.getAuthorsFollowing.getData(undefined);

			// Update follows query with optimistic delete
			utils.follow.getAuthorsFollowing.setData(
				undefined,
				(old) => old?.filter((follow) => follow.authorId !== authorId)
			);

			return { previousFollows };
		},
		onSuccess: () => {
			toast({
				title: `Unfollowed @${username}`,
				description: `Successfully unfollowed @${username}`,
				status: "success",
				isClosable: true
			});
		},
		onError: (e, _, context) => {
			// Something unexpected happened
			toast({
				title: "Something went wrong",
				description: `Unable to unfollow @${username}`,
				status: "error",
				isClosable: true
			});

			// Reset the optimistic update
			utils.follow.getAuthorsFollowing.setData(undefined, context?.previousFollows);

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
			isLoading={isLoading}
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
