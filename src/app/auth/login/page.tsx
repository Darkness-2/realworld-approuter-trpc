import LoginForm from "$/app/auth/login/LoginForm";
import Link from "$/components/ui/Link";
import { getPageSession } from "$/server/auth/lucia";
import { Container, Stack, Text } from "@chakra-ui/react";
import { redirect } from "next/navigation";

export default async function LoginPage() {
	// Redirect if user is logged in
	const session = await getPageSession("GET");
	if (session) redirect("/");

	return (
		<Container maxW="xl" mt={8}>
			<Stack gap={2} alignItems="center">
				<Text as="h1" fontSize="4xl" align="center">
					Login
				</Text>
				<Link href="/auth/signup" color="green.500" _hover={{ color: "green.400", textDecoration: "underline" }}>
					Need an account?
				</Link>
				<LoginForm />
			</Stack>
		</Container>
	);
}
