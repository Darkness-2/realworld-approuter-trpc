"use client";

import { createArticleSchema } from "$/lib/schemas/article";
import { trpc } from "$/lib/trpc/client";
import { type RouterInputs } from "$/lib/trpc/shared";
import { AddIcon } from "@chakra-ui/icons";
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Tag,
	TagCloseButton,
	TagLabel,
	Textarea
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, type KeyboardEvent } from "react";
import { useForm } from "react-hook-form";

type CreateArticleForm = RouterInputs["article"]["create"];

export default function CreateArticleForm() {
	const router = useRouter();
	const utils = trpc.useUtils();

	const [tag, setTag] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		getValues,
		setValue,
		watch,
		clearErrors
	} = useForm<CreateArticleForm>({
		defaultValues: {
			body: "",
			description: "",
			tags: [],
			title: ""
		},
		resolver: zodResolver(createArticleSchema)
	});

	const create = trpc.article.create.useMutation({
		onSuccess: (data) => {
			// Invalidate any queries that depend on articles
			utils.article.invalidate();

			// Redirect to the created article
			router.push(`/article/${data.articleId}`);
			router.refresh();
		},
		onError: (e) => {
			// Something unexpected happened
			console.error(e);
			setError("root", { message: e.message });
		}
	});

	const handleTagEnter = (e: KeyboardEvent<HTMLInputElement>) => {
		// If key was enter, add to the list
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddTag();
		}
	};

	const handleAddTag = () => {
		if (tag.length === 0) return;
		setValue("tags", [...(getValues("tags") ?? []), tag]);
		setTag("");
	};

	const handleRemoveTag = (text: string) => {
		const newTags = (getValues("tags") ?? []).filter((tag) => tag !== text);
		setValue("tags", newTags);
	};

	return (
		<Box
			as="form"
			w="full"
			mt={2}
			onSubmit={handleSubmit((v) => create.mutate(v))}
			onChange={() => clearErrors("root")}
		>
			<Stack gap={4}>
				{errors.root && (
					<Alert status="error">
						<AlertIcon />
						{errors.root.message}
					</Alert>
				)}

				<FormControl isInvalid={!!errors.title}>
					<FormLabel htmlFor="title">Title:</FormLabel>
					<Input id="title" type="text" {...register("title")} />
					<FormErrorMessage>{errors.title?.message}</FormErrorMessage>
				</FormControl>

				<FormControl isInvalid={!!errors.description}>
					<FormLabel htmlFor="description">Description:</FormLabel>
					<Input id="description" type="text" {...register("description")} />
					<FormErrorMessage>{errors.description?.message}</FormErrorMessage>
				</FormControl>

				<FormControl isInvalid={!!errors.body}>
					<FormLabel htmlFor="body">Body:</FormLabel>
					<Textarea id="body" resize="none" rows={6} {...register("body")} />
					<FormErrorMessage>{errors.body?.message}</FormErrorMessage>
				</FormControl>

				<FormControl isInvalid={!!errors.tags}>
					<FormLabel htmlFor="tags">Tags:</FormLabel>
					<InputGroup>
						<Input
							id="tags"
							type="text"
							value={tag}
							onChange={(e) => setTag(e.target.value)}
							onKeyDown={handleTagEnter}
						/>
						<InputRightElement>
							<IconButton
								icon={<AddIcon />}
								isRound={true}
								size="xs"
								variant="solid"
								colorScheme="gray"
								aria-label="Add tag"
								onClick={handleAddTag}
							/>
						</InputRightElement>
					</InputGroup>
					<Flex gap={1} mt={2} wrap="wrap">
						{(watch("tags") ?? []).map((tag, index) => (
							<Tag key={index} size="sm" variant="solid" colorScheme="gray">
								<TagLabel>{tag}</TagLabel>
								<TagCloseButton onClick={() => handleRemoveTag(tag)} />
							</Tag>
						))}
					</Flex>
					<FormErrorMessage>{errors.tags?.message}</FormErrorMessage>
				</FormControl>

				{/* Todo: Change buttons to use Chakra loading state */}
				<Button type="submit" colorScheme="green" px={8} alignSelf="center" disabled={create.isLoading}>
					{create.isLoading ? "Creating..." : "Create"}
				</Button>
			</Stack>
		</Box>
	);
}
