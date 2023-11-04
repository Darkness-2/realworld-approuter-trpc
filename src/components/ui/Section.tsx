import { Container } from "@chakra-ui/react";
import { type ReactNode } from "react";

export default function Section({ children }: { children: ReactNode }) {
	return (
		<Container maxW="6xl" py={8}>
			{children}
		</Container>
	);
}
