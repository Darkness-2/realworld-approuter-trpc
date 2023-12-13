"use client";

import AuthorAndDate from "$/components/article/AuthorAndDate";
import DeleteCommentButton from "$/components/comment/DeleteCommentButton";
import { useUser } from "$/lib/hooks/auth";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { Card, CardBody, CardFooter, Flex, Skeleton, Text } from "@chakra-ui/react";

type Comment = RouterOutputs["comment"]["getArticleComments"]["comments"][number];

type CommentProps =
	| {
			comment: Comment;
			isLoading?: false;
	  }
	| {
			comment?: undefined;
			isLoading: true;
	  };

// Used if Comment is in loading state
const mockData: Comment = {
	id: "abc",
	articleId: "abc",
	author: {
		username: "abc"
	},
	authorId: "abc",
	body: "abc",
	createdAt: new Date()
};

export default function Comment({ comment = mockData, isLoading = false }: CommentProps) {
	const { user } = useUser();
	const { author, body, createdAt, id, authorId } = comment;

	const isOwnComment = user?.userId === authorId;

	return (
		// Todo: Add update button if comment is the user's
		<Card border="1px" borderColor="gray.200" boxShadow="none">
			<CardBody py={4}>
				<Skeleton isLoaded={!isLoading}>
					<Text>{body}</Text>
				</Skeleton>
			</CardBody>
			<CardFooter bg="gray.100" py={3}>
				<Flex w="full" justifyContent="space-between" alignItems="center">
					<Skeleton isLoaded={!isLoading}>
						<AuthorAndDate createdAt={createdAt} username={author.username} variant="dark" asRow />
					</Skeleton>
					{isOwnComment && <DeleteCommentButton commentId={id} />}
				</Flex>
			</CardFooter>
		</Card>
	);
}
