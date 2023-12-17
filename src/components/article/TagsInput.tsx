import Tag from "$/components/article/Tag";
import { AddIcon } from "@chakra-ui/icons";
import {
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	IconButton,
	Input,
	InputGroup,
	InputRightElement
} from "@chakra-ui/react";
import { useState, type KeyboardEvent } from "react";
import { type FieldErrors } from "react-hook-form";

type Tags = string[] | undefined;

type TagsInputProps = {
	tags: Tags;
	error?: FieldErrors<{ tags: Tags }>["tags"];
	setTags: (tags: Tags) => void;
};

export default function TagsInput(props: TagsInputProps) {
	// Represents current tag being entered
	const [tag, setTag] = useState("");

	const handleTagEnter = (e: KeyboardEvent<HTMLInputElement>) => {
		// If key was enter, add to the list
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddTag();
		}
	};

	const handleAddTag = () => {
		if (tag.length === 0) return;
		const newTags = [...(props.tags ?? []), tag];
		props.setTags(newTags);
		setTag("");
	};

	const handleRemoveTag = (text: string) => {
		const newTags = (props.tags ?? []).filter((tag) => tag !== text);
		props.setTags(newTags);
	};

	return (
		<FormControl isInvalid={!!props.error}>
			<FormLabel htmlFor="tags">Tags:</FormLabel>
			<InputGroup>
				<Input id="tags" type="text" value={tag} onChange={(e) => setTag(e.target.value)} onKeyDown={handleTagEnter} />
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
				{(props.tags ?? []).map((tag, index) => (
					<Tag key={index} text={tag} closeFunction={() => handleRemoveTag(tag)} />
				))}
			</Flex>
			<FormErrorMessage>{props.error?.message}</FormErrorMessage>
		</FormControl>
	);
}
