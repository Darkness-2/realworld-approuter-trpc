import { withRequireSession } from "$/components/hocs/withSession";

function NewArticlePage() {
	return <div>NewArticlePage</div>;
}

export default withRequireSession(NewArticlePage, "/auth/login");
