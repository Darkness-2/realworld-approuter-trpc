import CreateArticleForm from "$/app/new/CreateArticleForm";
import FormPage from "$/components/FormPage";
import { withRequireSession } from "$/components/hocs/withSession";

function NewArticlePage() {
	return (
		<FormPage title="Create a new article" containerWidth="2xl">
			<CreateArticleForm />
		</FormPage>
	);
}

export default withRequireSession(NewArticlePage, "/auth/login");
