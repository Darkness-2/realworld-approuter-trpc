"use client";

import Link from "$/components/ui/Link";
import { Box, Text } from "@chakra-ui/react";

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
			{/* Note suppressHydrationWarning below is okay as date errors are to be expected */}
			{/* See https://nextjs.org/docs/messages/react-hydration-error#solution-3-using-suppresshydrationwarning */}
			<Text fontSize="xs" color={dateTextColor} suppressHydrationWarning>
				{createdAt.toLocaleDateString("en-CA", {
					dateStyle: "long"
				})}
			</Text>
		</Box>
	);
}
