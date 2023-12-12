import AuthorAndDate from "$/components/article/AuthorAndDate";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { Card, CardBody, CardFooter, Skeleton, Text } from "@chakra-ui/react";

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
	const { author, body, createdAt } = comment;

	return (
		// Todo: Add delete button if comment is the user's
		// Todo: Add update button if comment is the user's
		<Card border="1px" borderColor="gray.200" boxShadow="none">
			<CardBody py={4}>
				<Skeleton isLoaded={!isLoading}>
					<Text>{body}</Text>
				</Skeleton>
			</CardBody>
			<CardFooter bg="gray.100" py={3}>
				<Skeleton isLoaded={!isLoading}>
					<AuthorAndDate createdAt={createdAt} username={author.username} variant="dark" asRow />
				</Skeleton>
			</CardFooter>
		</Card>
	);
}
