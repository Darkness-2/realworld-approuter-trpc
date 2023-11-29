"use client";

import { useIsClient } from "$/lib/hooks/general";
import { dateFormatter } from "$/lib/utils/helpers";
import { Text, type TextProps } from "@chakra-ui/react";

type DateTextProps = TextProps & {
	date: Date;
};

/**
 * Helper componenet that deals with the hydration issue related to dates.
 * @param props standard set of props for Chakra's <Text />
 * @returns React Component
 */
export default function DateText({ date, ...rest }: DateTextProps) {
	const isClient = useIsClient();

	const dateText = dateFormatter.format(date);
	const key = `${dateText}-${isClient.toString()}`;

	return (
		/**
		 * Note: suppressHydrationWarning is okay here as dates are expected to be different between server and client
		 * Also using key here to ensure the date is re-rendered once on client
		 * @see https://nextjs.org/docs/messages/react-hydration-error#solution-3-using-suppresshydrationwarning
		 */
		<Text {...rest} key={key} suppressHydrationWarning>
			{dateText}
		</Text>
	);
}
