import Article from "$/components/article/Article";
import PaginationButtons, { type PaginationButtonsProps } from "$/components/ui/PaginationButtons";
import { Stack, StackDivider } from "@chakra-ui/react";
import { type ComponentProps } from "react";

type ArticleListProps = {
	articles: ComponentProps<typeof Article>["article"][];
	paginationOptions?: PaginationButtonsProps;
};

export default function ArticleList({ articles, paginationOptions }: ArticleListProps) {
	return (
		<Stack gap={2} divider={<StackDivider />}>
			{articles.map((article) => (
				<Article key={article.id} article={article} />
			))}
			{paginationOptions && <PaginationButtons {...paginationOptions} />}
		</Stack>
	);
}
