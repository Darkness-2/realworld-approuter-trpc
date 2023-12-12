"use client";

import CreateCommentForm from "$/app/article/[articleId]/CreateCommentForm";
import Comment from "$/components/comment/Comment";
import CommentList from "$/components/comment/CommentList";
import LoadMoreButton from "$/components/ui/LoadMoreButton";
import { useUser } from "$/lib/hooks/auth";
import { trpc } from "$/lib/trpc/client";
import { Stack, StackDivider } from "@chakra-ui/react";

const DEFAULT_PAGE_SIZE = 10;

type CommentsInfiniteScrollProps = {
	articleId: string;
};

export default function CommentsInfiniteScroll({ articleId }: CommentsInfiniteScrollProps) {
	const { user } = useUser();

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

	// Merge comments from the pages together
	const mergedComments = data?.pages.flatMap((page) => [...page.comments]) ?? [];

	return (
		<Stack gap={2} divider={<StackDivider />}>
			{/* Display loading state if loading; otherwise show comment list */}
			{isLoading && <Comment isLoading={true} />}

			<Stack gap={4}>
				{!isLoading && mergedComments.length > 0 && <CommentList comments={mergedComments} />}

				{/* Load more button, only shown if another page is available */}
				<LoadMoreButton isFetching={isFetching} hasNextPage={hasNextPage} onClick={fetchNextPage}>
					Load more comments
				</LoadMoreButton>

				{/* Display the add comment form if there is a user */}
				{user && <CreateCommentForm articleId={articleId} />}
			</Stack>
		</Stack>
	);
}
