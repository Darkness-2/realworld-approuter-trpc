import DateText from "$/components/ui/DateText";
import Link from "$/components/ui/Link";
import { Box } from "@chakra-ui/react";

type AuthorAndDateProps = {
	createdAt: Date;
	username: string;
	variant: "light" | "dark";
};

export default function AuthorAndDate({ createdAt, username, variant }: AuthorAndDateProps) {
	const linkTextColor = variant === "light" ? "green.400" : "green.500";
	const dateTextColor = variant === "light" ? "gray.400" : "gray.500";

	return (
		<Box>
			<Link href={`/user/${username}`} textColor={linkTextColor} fontWeight="medium">
				@{username}
			</Link>

			<DateText date={createdAt} fontSize="xs" color={dateTextColor} />
		</Box>
	);
}
