"use client";

import { trpc } from "$/lib/trpc/client";
import { Stack, StackDivider } from "@chakra-ui/react";

const DEFAULT_PAGE_SIZE = 10;

type CommentsInfiniteScrollProps = {
	articleId: string;
};

export default function CommentsInfiniteScroll({ articleId }: CommentsInfiniteScrollProps) {
	const { data, hasNextPage, fetchNextPage, isFetching, isLoading } = trpc.comment.getArticleComments.useInfiniteQuery(
		{ articleId, limit: DEFAULT_PAGE_SIZE },
		{
			getNextPageParam: (lastPage) => {
				const lastComment = lastPage.comments.slice(-1);

				// Return the last comment's createdAt or undefined if there are no more
				return lastPage.hasMore ? lastComment?.[0]?.createdAt : undefined;
			},
			// Set stale time to five minutes
			staleTime: 5 * 60 * 1000
		}
	);

	return (
		<Stack gap={2} divider={<StackDivider />}>
			Todo
		</Stack>
	);
}
