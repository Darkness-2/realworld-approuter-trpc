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

	const toggleFollow = trpc.follow.toggleFollow.useMutation({
		onMutate: async ({ authorId, action }) => {
			// Cancel anything outgoing so it doesn't override
			await utils.follow.getAuthorsFollowing.cancel(undefined);

			// Snapshot the previous value
			const previousFollows = utils.follow.getAuthorsFollowing.getData(undefined);

			// Generate the new follow
			const newFollow: RouterOutputs["follow"]["getAuthorsFollowing"][number] = {
				authorId
			};

			// Optimistically update the follows query based on the action
			switch (action) {
				case "follow":
					utils.follow.getAuthorsFollowing.setData(undefined, (old) => (old ? [...old, newFollow] : [newFollow]));
					break;

				case "unfollow":
					utils.follow.getAuthorsFollowing.setData(
						undefined,
						(old) => old?.filter((follow) => follow.authorId !== authorId)
					);
					break;
			}

			return { previousFollows };
		},
		onSuccess: (_, { action }) => {
			toast({
				title: action === "follow" ? `Followed @${username}` : `Unfollowed @${username}`,
				description:
					action === "follow" ? `Successfully followed @${username}` : `Successfully unfollowed @${username}`,
				status: "success",
				isClosable: true
			});
		},
		onError: (e, { action }, context) => {
			// Something unexpected happening
			toast({
				title: "Something went wrong",
				description: action === "follow" ? `Unable to follow @${username}` : `Unable to unfollow @${username}`,
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

	const handleClick = () => {
		if (isFollowing) toggleFollow.mutate({ authorId, action: "unfollow" });
		if (!isFollowing) toggleFollow.mutate({ authorId, action: "follow" });
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
