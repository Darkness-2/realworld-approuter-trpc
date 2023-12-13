"use client";

import { trpc } from "$/lib/trpc/client";
import { DeleteIcon } from "@chakra-ui/icons";
import { IconButton, useToast } from "@chakra-ui/react";

type DeleteCommentButtonProps = {
	commentId: string;
};

export default function DeleteCommentButton({ commentId }: DeleteCommentButtonProps) {
	const toast = useToast();
	const utils = trpc.useUtils();

	const deleteComment = trpc.comment.delete.useMutation({
		onSuccess: () => {
			// Show success message, clear router cache, and invalidate comments
			toast({
				title: "Comment deleted",
				description: "The comment was successfully deleted",
				status: "success",
				isClosable: true
			});

			utils.comment.invalidate();
		},
		onError: (e) => {
			// Deal with expected errors
			if (e.data?.commentError === "COMMENT_FAILED_TO_DELETE") {
				return toast({
					title: "Comment failed to delete",
					status: "error",
					isClosable: true
				});
			}

			// Something unexpected happened
			console.error(e);
			toast({
				// Todo: Extract generic "oops" error into helper function
				title: "Something went wrong",
				status: "error",
				isClosable: true
			});
		}
	});

	return (
		<IconButton
			size="xs"
			colorScheme="red"
			aria-label="Delete comment"
			icon={<DeleteIcon />}
			isLoading={deleteComment.isLoading}
			onClick={() => deleteComment.mutate(commentId)}
		/>
	);
}
