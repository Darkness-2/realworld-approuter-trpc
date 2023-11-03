import Link from "$/components/ui/Link";
import Section from "$/components/ui/Section";
import { Container, Stack, Text } from "@chakra-ui/react";
import { type ReactNode } from "react";

type Props = {
	children: ReactNode;
	title: string;
	linkText: string;
	linkHref: string;
};

export default function AuthPage({ children, linkText, linkHref, title }: Props) {
	return (
		<Section>
			<Container maxW="xl">
				<Stack gap={2} alignItems="center">
					<Text as="h1" fontSize="4xl" align="center">
						{title}
					</Text>
					<Link href={linkHref} color="green.500" _hover={{ color: "green.400", textDecoration: "underline" }}>
						{linkText}
					</Link>
					{children}
				</Stack>
			</Container>
		</Section>
	);
}
