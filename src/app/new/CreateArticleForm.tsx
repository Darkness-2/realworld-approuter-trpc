"use client";

import TagsInput from "$/components/article/TagsInput";
import CustomInput from "$/components/forms/CustomInput";
import CustomTextarea from "$/components/forms/CustomTextarea";
import RootErrorMessage from "$/components/forms/RootErrorMessage";
import SubmitButton from "$/components/forms/SubmitButton";
import { createArticleSchema } from "$/lib/schemas/article";
import { trpc } from "$/lib/trpc/client";
import { type RouterInputs } from "$/lib/trpc/shared";
import { Box, Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type CreateArticleForm = RouterInputs["article"]["create"];

export default function CreateArticleForm() {
	const router = useRouter();
	const utils = trpc.useUtils();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		setValue,
		clearErrors,
		watch
	} = useForm<CreateArticleForm>({
		resolver: zodResolver(createArticleSchema)
	});

	const create = trpc.article.create.useMutation({
		onSuccess: (data) => {
			// Invalidate any queries that depend on articles
			utils.article.invalidate();

			// Redirect to the created article
			router.refresh();
			router.push(`/article/${data.articleId}`);
		},
		onError: (e) => {
			// Something unexpected happened
			console.error(e);
			setError("root", { message: e.message });
		}
	});

	return (
		<Box
			as="form"
			w="full"
			mt={2}
			onSubmit={handleSubmit((v) => create.mutate(v))}
			onChange={() => clearErrors("root")}
		>
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

				<SubmitButton isLoading={create.isLoading}>Create</SubmitButton>
			</Stack>
		</Box>
	);
}
