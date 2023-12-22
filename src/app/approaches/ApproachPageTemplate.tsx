import ExampleButtons from "$/components/example/ExampleButtons";
import Section from "$/components/ui/Section";
import { Button, Stack, StackDivider, Text } from "@chakra-ui/react";
import Link from "next/link";
import { type ReactNode } from "react";

type ApproachPageTemplateProps = {
	heading: string;
	children: ReactNode;
	displayButtons?: boolean;
	pros: string[];
	cons: string[];
};

export default function ApproachPageTemplate({
	heading,
	displayButtons = false,
	pros,
	cons,
	children
}: ApproachPageTemplateProps) {
	return (
		<Section>
			<Stack gap={4} divider={<StackDivider />}>
				<Text as="h1" fontSize="2xl" fontWeight="semibold">
					{heading}
				</Text>

				{children}

				{displayButtons && <ExampleButtons />}

				<Button as={Link} href="/approaches" colorScheme="gray" w="fit-content" size="sm">
					Back to approaches
				</Button>
			</Stack>
		</Section>
	);
}
