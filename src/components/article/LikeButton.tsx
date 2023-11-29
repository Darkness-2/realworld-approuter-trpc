"use client";

import { useLikedArticles } from "$/lib/hooks/article";
import { StarIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

// Todo: Make button like the article

type LikeButtonProps = {
	likes: number;
	articleId: string;
};

export default function LikeButton({ likes, articleId }: LikeButtonProps) {
	const { likedArticles, isLoading } = useLikedArticles();

	// Determine if the user likes this article
	const isLiked = likedArticles && likedArticles.some((a) => a.articleId === articleId);

	return (
		<Button
			isLoading={isLoading}
			size="xs"
			variant="solid"
			// Show as gray while loading or if user has liked
			colorScheme={isLiked || isLoading ? "gray" : "green"}
			leftIcon={<StarIcon />}
		>
			Like Article ({likes})
		</Button>
	);
}
