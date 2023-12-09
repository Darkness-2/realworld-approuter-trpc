import EditArticleForm from "$/app/edit/[articleId]/EditArticleForm";
import FormPage from "$/components/forms/FormPage";
import { withRequireSession, type SessionRequiredProps } from "$/components/hocs/withSession";
import { getServerTRPCClient } from "$/lib/trpc/serverClient";
import { notFound, redirect } from "next/navigation";

type EditPageProps = SessionRequiredProps & {
	params: {
		articleId: string;
	};
};

// Todo: Add not-found boundary

async function EditPage({ params, session }: EditPageProps) {
	const article = await getServerTRPCClient().article.getArticleById.fetch(params.articleId);
	if (!article) notFound();

	// If the user doesn't match the article author, redirect
	if (session.user.userId !== article.authorId) redirect("/unauthorized");

	// Generate tags in the correct format
	const tags = article.articlesToTags.map((rel) => rel.tag.text);

	return (
		<FormPage
			title="Edit article"
			containerWidth="2xl"
			linkText="View this article"
			linkHref={`/article/${article.id}`}
		>
			<EditArticleForm article={{ ...article, tags }} />
		</FormPage>
	);
}

export default withRequireSession(EditPage, "/");
