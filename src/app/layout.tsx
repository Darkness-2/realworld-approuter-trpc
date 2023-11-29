import Navbar from "$/components/Navbar";
import "$/styles/globals.css";
import { Flex } from "@chakra-ui/react";
import type { Metadata } from "next";
import { type ReactNode } from "react";
import Providers from "./Providers";

// Todo: Add metadata to other pages
// Todo: Add other metadata for open graph
export const metadata: Metadata = {
	title: "conduit",
	description: "A place to share your knowledge"
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<Flex direction="column" minH="100vh">
						<Navbar />
						<Flex as="main" flexDir="column" flexGrow={1}>
							{children}
						</Flex>
					</Flex>
				</Providers>
			</body>
		</html>
	);
}
