import DateText from "$/components/ui/DateText";
import Link from "$/components/ui/Link";
import { Flex } from "@chakra-ui/react";

type AuthorAndDateProps = {
	createdAt: Date;
	username: string;
	variant: "light" | "dark";
	asRow?: boolean;
	isLoading?: boolean;
};

export default function AuthorAndDate({
	createdAt,
	username,
	variant,
	asRow = false,
	isLoading = false
}: AuthorAndDateProps) {
	const linkTextColor = variant === "light" ? "green.400" : "green.500";
	const dateTextColor = variant === "light" ? "gray.400" : "gray.500";

	return (
		<Flex
			flexDirection={asRow ? "row" : "column"}
			alignItems={asRow ? "center" : undefined}
			gap={asRow ? 2 : undefined}
		>
			<Link href={`/user/${username}`} textColor={linkTextColor} fontWeight="medium" prefetch={!isLoading}>
				@{username}
			</Link>

			<DateText date={createdAt} fontSize="xs" color={dateTextColor} />
		</Flex>
	);
}
