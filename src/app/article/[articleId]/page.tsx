import { getServerClient } from "$/lib/trpc/serverClient";
import { notFound } from "next/navigation";

type ArticlePageProps = {
	params: {
		articleId: string;
	};
};

// Todo: Add not-found boundary

// Todo: Look into generateStaticParams
// See: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params

export default async function ArticlePage({ params }: ArticlePageProps) {
	const article = await getServerClient().article.getArticleById(params.articleId);
	if (!article) notFound();

	return <div>ArticlePage</div>;
}

// Todo: Add revalidate
