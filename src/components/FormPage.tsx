import Link from "$/components/ui/Link";
import Section from "$/components/ui/Section";
import { Container, Stack, Text } from "@chakra-ui/react";
import { type ComponentProps, type ReactNode } from "react";

type Props = {
	children: ReactNode;
	title: string;
	linkText?: string;
	linkHref?: string;
	containerWidth?: ComponentProps<typeof Container>["maxW"];
};

export default function FormPage({ children, linkText, linkHref, title, containerWidth }: Props) {
	return (
		<Section>
			<Container maxW={containerWidth ?? "xl"}>
				<Stack gap={2} alignItems="center">
					<Text as="h1" fontSize="4xl" align="center">
						{title}
					</Text>
					{linkText && linkHref && (
						<Link href={linkHref} color="green.500" _hover={{ color: "green.400", textDecoration: "underline" }}>
							{linkText}
						</Link>
					)}
					{children}
				</Stack>
			</Container>
		</Section>
	);
}
