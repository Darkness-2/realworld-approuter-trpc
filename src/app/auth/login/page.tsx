import LoginForm from "$/app/auth/login/LoginForm";
import AuthPage from "$/components/auth/AuthPage";
import { getPageSession } from "$/server/auth/lucia";
import { redirect } from "next/navigation";

export default async function LoginPage() {
	// Redirect if user is logged in
	const session = await getPageSession("GET");
	if (session) redirect("/");

	return (
		<AuthPage title="Login" linkHref="/auth/signup" linkText="Need an account?">
			<LoginForm />
		</AuthPage>
	);
}
