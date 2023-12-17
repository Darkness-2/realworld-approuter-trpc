import { Tag as ChakraTag, TagCloseButton, TagLabel } from "@chakra-ui/react";

type TagProps = {
	text: string;
	// Optional function for the close button
	closeFunction?: () => void;
};

export default function Tag({ text, closeFunction }: TagProps) {
	return (
		<ChakraTag size="sm" variant="outline" colorScheme="gray">
			<TagLabel>{text}</TagLabel>
			{/* Display close button if the closeFunction is provided */}
			{closeFunction && <TagCloseButton onClick={closeFunction} />}
		</ChakraTag>
	);
}
