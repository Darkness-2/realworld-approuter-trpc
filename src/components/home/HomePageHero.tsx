import { Box, Container, Stack, Text } from "@chakra-ui/react";

export default function HomePageHero() {
	return (
		<Box bgColor="green.500" p={8} shadow="inner">
			<Container maxW="6xl">
				<Stack alignItems="center" gap={2}>
					{/* Note: using custom text shadow as Chakra's appear to be broken :\ */}
					<Text
						as="h1"
						fontSize="6xl"
						color="white"
						fontWeight="bold"
						align="center"
						textShadow="rgba(0, 0, 0, 0.3) 0px 1px 3px"
					>
						conduit
					</Text>
					<Text color="white" fontSize="2xl" align="center">
						A place to share your knowledge.
					</Text>
				</Stack>
			</Container>
		</Box>
	);
}
