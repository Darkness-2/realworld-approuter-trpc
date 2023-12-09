import { Alert, AlertIcon } from "@chakra-ui/react";
import { type FieldErrors } from "react-hook-form";

type RootErrorMessageProps = {
	error?: FieldErrors["root"];
};

export default function RootErrorMessage({ error }: RootErrorMessageProps) {
	return (
		<>
			{error && (
				<Alert status="error">
					<AlertIcon />
					{error.message}
				</Alert>
			)}
		</>
	);
}
