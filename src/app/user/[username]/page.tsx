import Article from "$/components/Article";
import { getServerClient } from "$/lib/trpc/serverClient";
import { db } from "$/server/db";
import { notFound } from "next/navigation";
import { type ComponentProps } from "react";

type UserPageProps = {
	params: {
		username: string;
	};
};

// Todo: Add not-found boundary

export default async function UserPage({ params }: UserPageProps) {
	const userArticles = await getServerClient().article.getArticlesByAuthorUsername({ username: params.username });
	if (!userArticles) notFound();

	// Re-attach author context as expected for article type
	const articles: ComponentProps<typeof Article>["article"][] = userArticles.articles.map((article) => ({
		...article,
		author: {
			username: userArticles.author.username
		}
	}));

	// Todo: UI for the page
	return (
		<>
			{articles.map((article) => (
				<Article key={article.id} article={article} />
			))}
		</>
	);
}

/**
 * Regenerate every 5 minutes.
 */
export const revalidate = 300;

/**
 * Will generate the page at build time for the authors of the 100 most recent articles.
 */
export const generateStaticParams = async (): Promise<UserPageProps["params"][]> => {
	const authorUsernames = await db.query.article.findMany({
		columns: {},
		limit: 100,
		orderBy: ({ createdAt }, { desc }) => desc(createdAt),
		with: {
			author: {
				columns: { username: true }
			}
		}
	});

	return authorUsernames.map(({ author: { username } }) => ({ username }));
};
