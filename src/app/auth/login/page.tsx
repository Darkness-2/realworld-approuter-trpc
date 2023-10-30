import LoginForm from "$/app/auth/login/LoginForm";
import { getPageSession } from "$/server/auth/lucia";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
	// Redirect if user is logged in
	const session = await getPageSession();
	if (session) redirect("/");

	return (
		<>
			<h1>Login</h1>
			<LoginForm />
			<Link href="/auth/signup">Sign up</Link>
		</>
	);
}
