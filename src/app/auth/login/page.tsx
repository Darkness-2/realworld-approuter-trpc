import LoginForm from "$/app/auth/login/LoginForm";
import AuthPage from "$/components/AuthPage";
import { withRequireNoSession } from "$/components/hocs/withSession";

// Todo: Add ?redirectTo= functionality

async function LoginPage() {
	return (
		<AuthPage title="Login" linkHref="/auth/signup" linkText="Need an account?">
			<LoginForm />
		</AuthPage>
	);
}

export default withRequireNoSession(LoginPage, "/");
