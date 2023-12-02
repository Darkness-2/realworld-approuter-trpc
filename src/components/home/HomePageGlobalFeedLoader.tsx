import HomePageGlobalFeed from "$/components/home/HomePageGlobalFeed";
import { getServerClient } from "$/lib/trpc/serverClient";
import { Skeleton } from "@chakra-ui/react";
import { Suspense } from "react";

const DEFAULT_PAGE_SIZE = 10;

/**
 * This component loads page 1 of the global feed so that can be server-side rendered
 */
export default async function HomePageGlobalFeedLoader() {
	const page = 1;

	const globalFeed = await getServerClient().article.getGlobalFeed({
		limit: DEFAULT_PAGE_SIZE,
		offset: (page - 1) * DEFAULT_PAGE_SIZE
	});

	return (
		<Suspense fallback={<Skeleton h="200px" w="200px" />}>
			<HomePageGlobalFeed globalFeed={globalFeed} pageSize={DEFAULT_PAGE_SIZE} />
		</Suspense>
	);
}
