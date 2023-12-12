import Comment from "$/components/comment/Comment";
import { Flex, Stack } from "@chakra-ui/react";
import { type ComponentProps } from "react";

type CommentListProps = {
	comments: Required<ComponentProps<typeof Comment>["comment"][]>;
};

export default function CommentList({ comments }: CommentListProps) {
	return (
		<Flex justifyContent="center">
			<Stack gap={2} w="full" maxW="xl">
				{comments.map((comment) => (
					<Comment key={comment.id} comment={comment} />
				))}
			</Stack>
		</Flex>
	);
}
