import Section from "$/components/ui/Section";
import { Button, Flex, Stack, StackDivider, Text } from "@chakra-ui/react";
import Link from "next/link";
import { type ReactNode } from "react";

type ApproachPageTemplateProps = {
	heading: string;
	children: ReactNode;
	buttons: ReactNode;
	pros: string[];
	cons: string[];
};

export default function ApproachPageTemplate({ heading, pros, cons, children, buttons }: ApproachPageTemplateProps) {
	return (
		<Section>
			<Stack gap={4} divider={<StackDivider />}>
				<Text as="h1" fontSize="2xl" fontWeight="semibold">
					{heading}
				</Text>

				{children}

				<Flex gap={2} wrap="wrap">
					{buttons}
				</Flex>

				<Button as={Link} href="/approaches" colorScheme="gray" w="fit-content" size="sm">
					Back to approaches
				</Button>
			</Stack>
		</Section>
	);
}
