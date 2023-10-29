"use client";

import TRPCProvider from "$/lib/trpc/TRPCProvider";
import { theme } from "$/styles/theme";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { type ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<>
			<TRPCProvider>
				<CacheProvider>
					<ChakraProvider theme={theme}>{children}</ChakraProvider>
				</CacheProvider>
			</TRPCProvider>
		</>
	);
}
