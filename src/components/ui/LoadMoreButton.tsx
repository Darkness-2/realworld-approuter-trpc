import { Button, Flex, type ButtonProps } from "@chakra-ui/react";
import { type ReactNode } from "react";

type LoadMoreButtonProps = ButtonProps & {
	isFetching: boolean;
	hasNextPage: boolean | undefined;
	onClick: () => void;
	children?: ReactNode;
};

export default function LoadMoreButton({ hasNextPage, isFetching, onClick, children, ...rest }: LoadMoreButtonProps) {
	return (
		<Flex justifyContent="center">
			{hasNextPage && (
				<Button {...rest} isLoading={isFetching} onClick={() => !isFetching && onClick()}>
					{children ?? "Load more"}
				</Button>
			)}
		</Flex>
	);
}
