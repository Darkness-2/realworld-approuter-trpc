import Section from "$/components/ui/Section";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Flex,
	Grid,
	GridItem,
	Heading,
	Stack,
	StackDivider,
	Text
} from "@chakra-ui/react";
import Link from "next/link";

type Approach = { label: string; href: string };

const QUERY_APPROACHES: Approach[] = [
	{ label: "React server component", href: "/approaches/queries/rsc" },
	{ label: "tRPC client-side", href: "/approaches/queries/trpc-client" },
	{ label: "tRPC in RSC", href: "/approaches/queries/trpc-rsc" },
	{ label: "tRPC in RSC, with initial data", href: "/approaches/queries/trpc-rsc-initial-data" },
	{ label: "tRPC in RSC, with hydration", href: "/approaches/queries/trpc-rsc-hydration" }
];

const MUTATION_APPROACHES: Approach[] = [
	{ label: "Next.js server action", href: "/approaches/mutations/server-action" },
	{ label: "tRPC client-side", href: "/approaches/mutations/trpc-client" },
	{ label: "tRPC in server action", href: "/approaches/mutations/trpc-server-action" }
];

export default function ApproachesPage() {
	return (
		<Section>
			<Stack gap={4} divider={<StackDivider />}>
				<Text as="h1" fontSize="2xl" fontWeight="semibold">
					Using tRPC in Next.js app router
				</Text>

				<ApproachButtons title="Queries (loading data)" approaches={QUERY_APPROACHES} />
				<ApproachButtons title="Mutations (manipulating data)" approaches={MUTATION_APPROACHES} />

				<Grid templateColumns="repeat(2, 1fr)" gap={4}>
					<GridItem>
						<Card>
							<CardHeader>
								<Heading size="md">Pros</Heading>
							</CardHeader>
							<CardBody>Todo</CardBody>
						</Card>
					</GridItem>

					<GridItem>
						<Card>
							<CardHeader>
								<Heading size="md">Cons</Heading>
							</CardHeader>
							<CardBody>Todo</CardBody>
						</Card>
					</GridItem>
				</Grid>
			</Stack>
		</Section>
	);
}

type ApproachButtonsProps = {
	approaches: Approach[];
	title: string;
};

function ApproachButtons({ approaches, title }: ApproachButtonsProps) {
	return (
		<Stack gap={2}>
			<Heading size="md">{title}</Heading>
			<Flex gap={2} wrap="wrap">
				{approaches.map((a) => (
					<Button key={a.href} as={Link} href={a.href} colorScheme="blue" size="sm">
						{a.label}
					</Button>
				))}
			</Flex>
		</Stack>
	);
}
