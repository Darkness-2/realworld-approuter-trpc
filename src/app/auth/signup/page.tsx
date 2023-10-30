import AuthForm from "$/components/AuthForm";
import { auth } from "$/server/auth/lucia";
import * as context from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
	// Redirect if user is logged in
	const authRequest = auth.handleRequest("GET", context);
	const session = await authRequest.validate();
	if (session) redirect("/");

	return (
		<>
			<h1>Sign up</h1>
			<AuthForm action="/api/auth/signup">
				<label htmlFor="username">Username:</label>
				<input type="text" name="username" id="username" />
				<br />
				<label htmlFor="password">Password:</label>
				<input type="text" name="password" id="password" />
				<br />
				<input type="submit" />
			</AuthForm>
			<Link href="/login">Sign in</Link>
		</>
	);
}
