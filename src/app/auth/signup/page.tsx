import SignupForm from "$/app/auth/signup/SignupForm";
import AuthPage from "$/components/AuthPage";
import { withRequireNoSession } from "$/components/hocs/withSession";

async function SignupPage() {
	return (
		<AuthPage title="Sign up" linkHref="/auth/login" linkText="Already have an account?">
			<SignupForm />
		</AuthPage>
	);
}

export default withRequireNoSession(SignupPage, "/");
