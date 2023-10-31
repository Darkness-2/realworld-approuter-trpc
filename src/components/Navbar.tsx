"use client";

import Link from "$/components/ui/Link";
import { useUser } from "$/lib/hooks/auth";
import { Box, Container, Flex, Text } from "@chakra-ui/react";

export default function Navbar() {
	const user = useUser();
	console.log(user);

	return (
		<Box as="nav" shadow="md" py={4}>
			<Container maxW="4xl">
				<Flex justifyContent="space-between" alignItems="center">
					<Text fontSize="2xl" color="green.500" fontWeight="semibold">
						conduit
					</Text>
					<Flex gap={2}>
						<Link href="/">Home</Link>
						<Link href="/auth/login">Sign in</Link>
						<Link href="/auth/signup">Sign up</Link>
					</Flex>
				</Flex>
			</Container>
		</Box>
	);
}
