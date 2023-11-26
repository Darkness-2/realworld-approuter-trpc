import { FormControl, FormErrorMessage, FormLabel, Textarea, type TextareaProps } from "@chakra-ui/react";
import { forwardRef } from "react";
import { type FieldError } from "react-hook-form";

type CustomTextareaProps = TextareaProps & {
	error?: FieldError;
	label: string;
	// Ensures these are required
	id: Required<TextareaProps["id"]>;
};

const CustomTextarea = forwardRef(function CustomTextarea(props: CustomTextareaProps, ref) {
	return (
		<FormControl isInvalid={!!props.error}>
			<FormLabel htmlFor={props.id}>{props.label}</FormLabel>
			<Textarea {...props} ref={ref} />
			<FormErrorMessage>{props.error?.message}</FormErrorMessage>
		</FormControl>
	);
});

export default CustomTextarea;
