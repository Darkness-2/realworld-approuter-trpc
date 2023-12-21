"use client";

import Link from "$/components/ui/Link";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Flex, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export default function HomePageHero() {
	return (
		<Box bgColor="green.500" p={8} shadow="inner">
			<Container maxW="6xl">
				<Stack alignItems="center" gap={2}>
					{/* Note: using custom text shadow as Chakra's appear to be broken :\ */}
					<Text
						as="h1"
						fontSize="6xl"
						color="white"
						fontWeight="bold"
						align="center"
						textShadow="rgba(0, 0, 0, 0.3) 0px 1px 3px"
					>
						conduit
					</Text>
					<Text color="white" fontSize="md" align="center">
						This project is a rough recreation of{" "}
						<Link href="https://www.realworld.how/" textDecoration="underline">
							Realworld.how
						</Link>{" "}
						using Next.js app router and tRPC.
					</Text>
					<Flex mt={2} gap={2} flexWrap="wrap" justifyContent="center">
						<Button as={NextLink} href="/approaches" colorScheme="gray" size="sm">
							Approaches for using tRPC in Next.js app router
						</Button>
						<Button
							as={NextLink}
							href="https://github.com/Darkness-2/realworld-approuter-trpc"
							target="_blank"
							colorScheme="gray"
							size="sm"
							rightIcon={<ExternalLinkIcon />}
						>
							View on Github
						</Button>
					</Flex>
				</Stack>
			</Container>
		</Box>
	);
}
