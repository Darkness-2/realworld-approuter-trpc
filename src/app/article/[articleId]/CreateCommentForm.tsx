"use client";

import CustomTextarea from "$/components/forms/CustomTextarea";
import RootErrorMessage from "$/components/forms/RootErrorMessage";
import SubmitButton from "$/components/forms/SubmitButton";
import { createCommentSchema } from "$/lib/schemas/comment";
import { trpc } from "$/lib/trpc/client";
import { type RouterInputs } from "$/lib/trpc/shared";
import { Box, Flex, Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type CreateCommentForm = RouterInputs["comment"]["create"];

type CreateCommentFormProps = {
	articleId: string;
};

export default function CreateCommentForm({ articleId }: CreateCommentFormProps) {
	const utils = trpc.useUtils();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		clearErrors,
		reset
	} = useForm<CreateCommentForm>({
		resolver: zodResolver(createCommentSchema)
	});

	// Register the articleId as it is not a user input
	register("articleId", { value: articleId });

	const create = trpc.comment.create.useMutation({
		// Todo: Make optimistic by adding the new comment to the top of the first page
		onMutate: () => {
			reset();
		},
		onSuccess: () => {
			// Invalidate any queries that depend on comments
			utils.comment.invalidate();
		},
		onError: (e) => {
			// Something unexpected happened
			console.error(e);
			setError("root", { message: e.message });
		}
	});

	return (
		<Flex justifyContent="center">
			<Box
				as="form"
				w="full"
				maxW="xl"
				onSubmit={handleSubmit((v) => create.mutate(v))}
				onChange={() => clearErrors("root")}
			>
				{/* Todo: format nicer */}
				<Stack gap={4}>
					<RootErrorMessage error={errors.root} />

					<CustomTextarea id="body" resize="none" rows={2} error={errors.body} {...register("body")} />

					<SubmitButton isLoading={create.isLoading}>Add comment</SubmitButton>
				</Stack>
			</Box>
		</Flex>
	);
}
