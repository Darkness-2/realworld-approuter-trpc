import { FormControl, FormErrorMessage, FormLabel, Input, type InputProps } from "@chakra-ui/react";
import { forwardRef } from "react";
import { type FieldError } from "react-hook-form";

type CustomInputProps = InputProps & {
	error?: FieldError;
	label: string;
	// Ensures these are required
	type: Required<InputProps["type"]>;
	id: Required<InputProps["id"]>;
};

// Todo: Replace forms with these

const CustomInput = forwardRef(function CustomInput(props: CustomInputProps, ref) {
	return (
		<FormControl isInvalid={!!props.error}>
			<FormLabel htmlFor={props.id}>{props.label}</FormLabel>
			<Input {...props} ref={ref} />
			<FormErrorMessage>{props.error?.message}</FormErrorMessage>
		</FormControl>
	);
});

export default CustomInput;
