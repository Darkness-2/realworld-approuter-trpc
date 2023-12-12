import Comment from "$/components/comment/Comment";
import { Stack } from "@chakra-ui/react";
import { type ComponentProps } from "react";

type CommentListProps = {
	comments: Required<ComponentProps<typeof Comment>["comment"][]>;
};

export default function CommentList({ comments }: CommentListProps) {
	return (
		<Stack gap={2}>
			{comments.map((comment) => (
				<Comment key={comment.id} comment={comment} />
			))}
		</Stack>
	);
}
