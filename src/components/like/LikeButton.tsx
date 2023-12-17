"use client";

import { useLikedArticles } from "$/lib/hooks/article";
import { trpc } from "$/lib/trpc/client";
import { StarIcon } from "@chakra-ui/icons";
import { Button, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

type LikeButtonProps = {
	likes: number;
	articleId: string;
};

export default function LikeButton({ likes, articleId }: LikeButtonProps) {
	const router = useRouter();
	const utils = trpc.useUtils();
	const toast = useToast();
	const { likedArticles, isLoading } = useLikedArticles();

	// Todo: Also optimistically update the article's like count

	const toggleLike = trpc.like.toggleLike.useMutation({
		onMutate: async ({ action, articleId }) => {
			// Cancel anything outgoing so it doesn't override
			await utils.like.getLikedArticlesList.cancel(undefined);

			// Snapshot the previous value
			const previousLikes = utils.like.getLikedArticlesList.getData(undefined);

			// Optimistically update the likes query based on the action
			switch (action) {
				case "like":
					utils.like.getLikedArticlesList.setData(undefined, (old) => (old ? [...old, articleId] : [articleId]));
					break;

				case "unlike":
					utils.like.getLikedArticlesList.setData(undefined, (old) => old?.filter((like) => like !== articleId));
					break;
			}

			return { previousLikes };
		},
		onError: (e, _, context) => {
			// Something unexpected happened
			toast({
				title: "Something went wrong",
				description: "Unable to like/unlike the article",
				status: "error",
				isClosable: true
			});

			// Reset the optimisitic update
			utils.like.getLikedArticlesList.setData(undefined, context?.previousLikes);

			console.error(e);
		},
		onSettled: () => {
			// Invalidate likes and articles; refresh router
			utils.article.invalidate();
			utils.like.invalidate();
			router.refresh();
		}
	});

	// Determine if the user likes this article
	const isLiked = likedArticles && likedArticles.some((like) => like === articleId);

	const handleClick = () => {
		if (isLiked) toggleLike.mutate({ articleId, action: "unlike" });
		if (!isLiked) toggleLike.mutate({ articleId, action: "like" });
	};

	return (
		<Button
			isLoading={isLoading}
			size="xs"
			variant="solid"
			// Show as gray while loading or if user has liked
			colorScheme={isLiked || isLoading ? "gray" : "green"}
			leftIcon={<StarIcon />}
			onClick={handleClick}
		>
			{isLiked ? "Unlike" : "Like"} article ({likes})
		</Button>
	);
}
