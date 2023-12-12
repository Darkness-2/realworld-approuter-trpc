import { Button, Flex, type ButtonProps } from "@chakra-ui/react";
import { type ReactNode } from "react";

type LoadMoreButtonProps = ButtonProps & {
	isFetching: boolean;
	hasNextPage: boolean | undefined;
	onClick: () => void;
	children?: ReactNode;
};

export default function LoadMoreButton({ hasNextPage, isFetching, onClick, children, ...rest }: LoadMoreButtonProps) {
	// If no next page, don't show anything
	if (!hasNextPage) return null;

	return (
		<Flex justifyContent="center">
			<Button {...rest} isLoading={isFetching} onClick={() => !isFetching && onClick()}>
				{children ?? "Load more"}
			</Button>
		</Flex>
	);
}
