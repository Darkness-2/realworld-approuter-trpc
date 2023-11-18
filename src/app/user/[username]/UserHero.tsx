"use client";

import FollowButton from "$/components/FollowButton";
import { useUser } from "$/lib/hooks/auth";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { SettingsIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Skeleton, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";

type UserHeroProps = {
	user: NonNullable<RouterOutputs["article"]["getArticlesByAuthorUsername"]>["author"];
};

export default function UserHero({ user }: UserHeroProps) {
	const { user: sessionUser, isLoading } = useUser();

	return (
		<Box bgColor="gray.300" py={8} shadow="inner">
			<Container maxW="6xl" centerContent>
				<Stack gap={2} align="center">
					<Text as="h1" fontSize="4xl" fontWeight="semibold">
						{user.username}
					</Text>
					{/* If loading, show skeleton */}
					{isLoading && <Skeleton h="24px" w="100px" />}
					{/* If logged in user is viewing their own page, show button to go their settings */}
					{sessionUser?.userId === user.id && (
						<Button as={Link} href="/settings" size="xs" variant="solid" colorScheme="gray" leftIcon={<SettingsIcon />}>
							Go to profile settings
						</Button>
					)}
					{/* If logged in user is viewing someone else's page, show follow button */}
					{sessionUser && sessionUser.userId !== user.id && <FollowButton username={user.username} />}
				</Stack>
			</Container>
		</Box>
	);
}
