import { Button } from "@chakra-ui/react";
import { type ReactNode } from "react";

type SubmitButtonProps = {
	isLoading: boolean;
	loadingText?: string;
	children: ReactNode;
};

// Todo: Use this across all forms

export default function SubmitButton({ children, isLoading, loadingText = "Loading..." }: SubmitButtonProps) {
	return (
		<Button type="submit" colorScheme="green" px={8} alignSelf="center" isLoading={isLoading} loadingText={loadingText}>
			{children}
		</Button>
	);
}
