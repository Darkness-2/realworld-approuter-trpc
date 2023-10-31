import SignupForm from "$/app/auth/signup/SignupForm";
import { getPageSession } from "$/server/auth/lucia";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignupPage() {
	// Redirect if user is logged in
	const session = await getPageSession("GET");
	if (session) redirect("/");

	return (
		<>
			<h1>Sign up</h1>
			<SignupForm />
			<Link href="/login">Sign in</Link>
		</>
	);
}
