import { Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function UnauthorizedPage() {
	return (
		<Flex gap={2} flexDir="column" flexGrow={1} justifyContent="center" alignItems="center">
			<Text as="h2" fontSize="2xl">
				You are unauthorized to view this page.
			</Text>
			<Button as={Link} size="sm" href="/">
				Return home
			</Button>
		</Flex>
	);
}
