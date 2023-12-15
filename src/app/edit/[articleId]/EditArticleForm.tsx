"use client";

import TagsInput from "$/components/article/TagsInput";
import CustomInput from "$/components/forms/CustomInput";
import CustomTextarea from "$/components/forms/CustomTextarea";
import RootErrorMessage from "$/components/forms/RootErrorMessage";
import SubmitButton from "$/components/forms/SubmitButton";
import { editArticleSchema } from "$/lib/schemas/article";
import { trpc } from "$/lib/trpc/client";
import { type RouterInputs } from "$/lib/trpc/shared";
import { Box, Stack, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type EditArticleForm = RouterInputs["article"]["edit"];

type EditArticleFormProps = {
	article: Required<EditArticleForm>;
};

export default function EditArticleForm({ article }: EditArticleFormProps) {
	const router = useRouter();
	const toast = useToast();
	const utils = trpc.useUtils();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		setValue,
		clearErrors,
		watch
	} = useForm<EditArticleForm>({
		defaultValues: {
			...article
		},
		resolver: zodResolver(editArticleSchema)
	});

	const edit = trpc.article.edit.useMutation({
		onSuccess: () => {
			// Invalidate any queries that depend on articles
			utils.article.invalidate();

			// Todo: Check if other forms need toasts

			// Toast for a message
			toast({
				title: "Article edited",
				description: "The article was successfully edited",
				status: "success",
				isClosable: true
			});

			// Redirect to the edited article
			router.push(`/article/${article.id}`);
			router.refresh();
		},
		onError: (e) => {
			if (e.data?.articleError === "ARTICLE_NOT_FOUND") {
				toast({
					title: "Article doesn't exist",
					description: "The article you tried to edit does not exist",
					status: "error",
					isClosable: true
				});
				return router.push("/");
			}

			if (e.data?.articleError === "ARTICLE_NOT_OWNED_BY_USER") {
				toast({
					title: "Article is not yours",
					description: "You don't own the article you tried to edit",
					status: "error",
					isClosable: true
				});
				return router.push("/unauthorized");
			}

			console.error(e);
			setError("root", { message: e.message });
		}
	});

	return (
		<Box as="form" w="full" mt={2} onSubmit={handleSubmit((v) => edit.mutate(v))} onChange={() => clearErrors("root")}>
			<Stack gap={4}>
				<RootErrorMessage error={errors.root} />

				<CustomInput id="title" type="text" label="Title" error={errors.title} {...register("title")} />

				<CustomInput
					id="description"
					type="text"
					label="Description"
					error={errors.description}
					{...register("description")}
				/>

				<CustomTextarea id="body" label="Body" resize="none" rows={6} error={errors.body} {...register("body")} />

				<TagsInput tags={watch("tags")} error={errors.tags} setTags={(t) => setValue("tags", t)} />

				<SubmitButton isLoading={edit.isLoading}>Edit</SubmitButton>
			</Stack>
		</Box>
	);
}
