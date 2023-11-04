"use client";

import Link from "$/components/ui/Link";
import { useUser } from "$/lib/hooks/auth";
import { Box, Container, Flex, Skeleton, Text } from "@chakra-ui/react";

export default function Navbar() {
	const { user, isLoading } = useUser();

	return (
		<Box as="nav" py={4}>
			<Container maxW="6xl">
				<Flex
					justifyContent="space-between"
					alignItems={{ sm: "center" }}
					flexDirection={{ base: "column", sm: "row" }}
					gap={2}
				>
					<Link href="/" _hover={{ textDecoration: "none" }}>
						<Text fontSize="2xl" color="green.500" fontWeight="semibold">
							conduit
						</Text>
					</Link>
					<Flex gap={2} wrap="wrap">
						<Link href="/">Home</Link>
						{isLoading ? (
							<>
								{/* Loading state */}
								<Skeleton h="24px" w="100px" />
							</>
						) : !user ? (
							<>
								{/* Logged-out state */}
								<Link href="/auth/login">Login</Link>
								<Link href="/auth/signup">Sign up</Link>
							</>
						) : (
							<>
								{/* Logged-in state */}
								<Link href="/new">New article</Link>
								<Link href="/settings">Settings</Link>
								<Link href={`@${user.username}`}>{user.username}</Link>
								<Link href="/auth/logout">Log out</Link>
							</>
						)}
					</Flex>
				</Flex>
			</Container>
		</Box>
	);
}
