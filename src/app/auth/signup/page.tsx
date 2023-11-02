import SignupForm from "$/app/auth/signup/SignupForm";
import AuthPage from "$/components/auth/AuthPage";
import { getPageSession } from "$/server/auth/lucia";
import { redirect } from "next/navigation";

export default async function SignupPage() {
	// Redirect if user is logged in
	const session = await getPageSession("GET");
	if (session) redirect("/");

	return (
		<AuthPage title="Sign up" linkHref="/auth/login" linkText="Already have an account?">
			<SignupForm />
		</AuthPage>
	);
}
