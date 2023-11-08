import LoginForm from "$/app/auth/login/LoginForm";
import FormPage from "$/components/FormPage";
import { withRequireNoSession } from "$/components/hocs/withSession";

// Todo: Add ?redirectTo= functionality

async function LoginPage() {
	return (
		<FormPage title="Login" linkHref="/auth/signup" linkText="Need an account?">
			<LoginForm />
		</FormPage>
	);
}

export default withRequireNoSession(LoginPage, "/");
