import { Link as ChakraLink, type LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import NextLink from "next/link";

interface LinkProps extends ChakraLinkProps {
	href: Required<ChakraLinkProps["href"]>;
}

/**
 * Custom wrapper around Chakra's Link to use next/link as the underlying component
 */
export default function Link(props: LinkProps) {
	return (
		<ChakraLink as={NextLink} {...props}>
			{props.children}
		</ChakraLink>
	);
}
