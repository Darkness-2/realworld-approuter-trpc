import SignupForm from "$/app/auth/signup/SignupForm";
import FormPage from "$/components/forms/FormPage";
import { withRequireNoSession } from "$/components/hocs/withSession";

async function SignupPage() {
	return (
		<FormPage title="Sign up" linkHref="/auth/login" linkText="Already have an account?">
			<SignupForm />
		</FormPage>
	);
}

export default withRequireNoSession(SignupPage, "/");
