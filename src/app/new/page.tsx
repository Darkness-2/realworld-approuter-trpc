import CreateArticleForm from "$/app/new/CreateArticleForm";
import { withRequireSession } from "$/components/hocs/withSession";
import Section from "$/components/ui/Section";
import { Container, Stack, Text } from "@chakra-ui/react";

function NewArticlePage() {
	return (
		<Section>
			<Container maxW="2xl">
				<Stack gap={2} alignItems="center">
					<Text as="h1" fontSize="4xl" align="center">
						Create a new article
					</Text>
					<CreateArticleForm />
				</Stack>
			</Container>
		</Section>
	);
}

export default withRequireSession(NewArticlePage, "/auth/login");
