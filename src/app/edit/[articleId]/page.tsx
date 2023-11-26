import FormPage from "$/components/forms/FormPage";
import { withRequireSession, type SessionRequiredProps } from "$/components/hocs/withSession";
import { getServerClient } from "$/lib/trpc/serverClient";
import { notFound, redirect } from "next/navigation";

type EditPageProps = SessionRequiredProps & {
	params: {
		articleId: string;
	};
};

// Todo: Add not-found boundary

async function EditPage({ params, session }: EditPageProps) {
	const article = await getServerClient().article.getArticleById(params.articleId);
	if (!article) notFound();

	// If the user doesn't match the article author, redirect
	if (session.user.userId !== article.authorId) redirect("/unauthorized");

	return (
		<FormPage
			title="Edit article"
			containerWidth="2xl"
			linkText="View this article"
			linkHref={`/article/${article.id}`}
		>
			Test
		</FormPage>
	);
}

export default withRequireSession(EditPage, "/");