"use client";

import Link from "$/components/ui/Link";
import { useIsClient } from "$/lib/hooks/general";
import { dateFormatter } from "$/lib/utils/helpers";
import { Box, Skeleton, Text } from "@chakra-ui/react";

type AuthorAndDateProps = {
	createdAt: Date;
	username: string;
	variant: "light" | "dark";
};

export default function AuthorAndDate({ createdAt, username, variant }: AuthorAndDateProps) {
	const isClient = useIsClient();

	const linkTextColor = variant === "light" ? "green.400" : "green.500";
	const dateTextColor = variant === "light" ? "gray.400" : "gray.500";

	const date = dateFormatter.format(createdAt);

	return (
		<Box>
			<Link href={`/user/${username}`} textColor={linkTextColor} fontWeight="medium">
				@{username}
			</Link>

			{/* Only render date on the client to avoid timezone hydration issues; render skeleton during SSR */}
			{isClient && (
				<Text fontSize="xs" color={dateTextColor}>
					{date}
				</Text>
			)}
			{!isClient && <Skeleton h="18px" w="80px" />}
		</Box>
	);
}
