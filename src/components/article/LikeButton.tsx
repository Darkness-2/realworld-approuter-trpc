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

	const like = trpc.article.likeArticle.useMutation({
		onError: (e) => {
			// Something unexpected happened
			toast({
				title: "Something went wrong",
				description: "Unable to like the article",
				status: "error",
				isClosable: true
			});

			console.error(e);
		},
		onSettled: () => {
			// Invalidate liked articles query and refresh the router
			utils.article.getLikedArticles.invalidate();
			router.refresh();
		}
	});

	const unlike = trpc.article.unlikeArticle.useMutation({
		onError: (e) => {
			// Something unexpected happened
			toast({
				title: "Something went wrong",
				description: "Unable to unlike the article",
				status: "error",
				isClosable: true
			});

			console.error(e);
		},
		onSettled: () => {
			// Invalidate liked articles query and refresh the router
			utils.article.getLikedArticles.invalidate();
			router.refresh();
		}
	});

	// Determine if the user likes this article
	const isLiked = likedArticles && likedArticles.some((a) => a.articleId === articleId);

	// Todo: Look into optimistic update for this

	const handleClick = () => {
		if (isLiked) unlike.mutate(articleId);
		if (!isLiked) like.mutate(articleId);
	};

	return (
		<Button
			isLoading={isLoading || like.isLoading || unlike.isLoading}
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
