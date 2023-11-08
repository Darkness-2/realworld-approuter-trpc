import FollowButton from "$/components/FollowButton";
import { type RouterOutputs } from "$/lib/trpc/shared";
import { Box, Container, Stack, Text } from "@chakra-ui/react";

type UserHeroProps = {
	user: NonNullable<RouterOutputs["article"]["getArticlesByAuthorUsername"]>["author"];
};

export default function UserHero({ user }: UserHeroProps) {
	return (
		<Box bgColor="gray.300" py={8} shadow="inner">
			<Container maxW="6xl" centerContent>
				<Stack gap={2} align="center">
					<Text as="h1" fontSize="4xl" fontWeight="semibold">
						{user.username}
					</Text>
					{/* Todo: Swap out with edit profile button for own user */}
					<FollowButton username={user.username} />
				</Stack>
			</Container>
		</Box>
	);
}
