import Link from "$/components/ui/Link";
import { Box, Text } from "@chakra-ui/react";

type AuthorAndDateProps = {
	createdAt: Date;
	username: string;
};

export default function AuthorAndDate({ createdAt, username }: AuthorAndDateProps) {
	return (
		<Box>
			<Link href={`/@${username}`} textColor="green.500" fontWeight="medium">
				@{username}
			</Link>
			<Text fontSize="xs" color="gray.500">
				{createdAt.toLocaleDateString("en-CA", {
					dateStyle: "long"
				})}
			</Text>
		</Box>
	);
}
