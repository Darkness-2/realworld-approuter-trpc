"use client";

import { trpc } from "$/lib/trpc/client";
import { DeleteIcon } from "@chakra-ui/icons";
import { Button, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

type DeleteArticleButtonProps = {
	articleId: string;
};

export default function DeleteArticleButton({ articleId }: DeleteArticleButtonProps) {
	const router = useRouter();
	const toast = useToast();
	const utils = trpc.useUtils();

	const deleteArticle = trpc.article.delete.useMutation({
		onSuccess: () => {
			// Show success message, clear router cache, redirect the user
			toast({
				title: "Article deleted",
				description: "The article was deleted successfully",
				status: "success",
				isClosable: true
			});

			utils.article.invalidate();
			router.push("/");
			// Todo: I think putting this after the push is causing duplicate requests to be sent
			// Should review that and change order of all router.refresh() calls
			router.refresh();
		},
		onError: (e) => {
			// Deal with expected errors
			if (e.data?.articleError === "ARTICLE_FAILED_TO_DELETE") {
				return toast({
					title: "Article failed to delete",
					status: "error",
					isClosable: true
				});
			}

			// Something unexpected happened
			console.error(e);
			toast({
				title: "Something went wrong",
				status: "error",
				isClosable: true
			});
		}
	});

	return (
		<Button
			size="xs"
			variant="solid"
			colorScheme="red"
			leftIcon={<DeleteIcon />}
			isLoading={deleteArticle.isLoading}
			onClick={() => deleteArticle.mutate(articleId)}
		>
			Delete article
		</Button>
	);
}
