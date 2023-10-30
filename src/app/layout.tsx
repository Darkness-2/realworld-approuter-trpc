import Navbar from "$/components/Navbar";
import "$/styles/globals.css";
import { Box, Flex } from "@chakra-ui/react";
import type { Metadata } from "next";
import { type ReactNode } from "react";
import Providers from "./Providers";

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app"
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<Flex direction="column" minH="100vh">
						<Navbar />
						<Box as="main" flexGrow={1}>
							{children}
						</Box>
					</Flex>
				</Providers>
			</body>
		</html>
	);
}
