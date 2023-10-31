"use client";

import Link from "$/components/ui/Link";
import { useUser } from "$/lib/hooks/auth";
import { Box, Container, Flex, Skeleton, Text } from "@chakra-ui/react";

export default function Navbar() {
	const { user, isLoading } = useUser();

	return (
		<Box as="nav" shadow="md" py={4}>
			<Container maxW="4xl">
				<Flex justifyContent="space-between" alignItems="center">
					<Link href="/" _hover={{ textDecoration: "none" }}>
						<Text fontSize="2xl" color="green.500" fontWeight="semibold">
							conduit
						</Text>
					</Link>
					<Flex gap={2}>
						<Link href="/">Home</Link>
						{isLoading ? (
							<Skeleton h="24px" w="100px" />
						) : !user ? (
							<>
								<Link href="/auth/login">Sign in</Link>
								<Link href="/auth/signup">Sign up</Link>
							</>
						) : (
							<p>{user.username}</p>
						)}
					</Flex>
				</Flex>
			</Container>
		</Box>
	);
}
