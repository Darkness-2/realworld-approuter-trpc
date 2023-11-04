import { Box } from "@chakra-ui/react";
import { type ReactNode } from "react";

export default function Section({ children }: { children: ReactNode }) {
	return <Box py={8}>{children}</Box>;
}
