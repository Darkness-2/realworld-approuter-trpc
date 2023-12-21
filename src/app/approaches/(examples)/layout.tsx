import { type ReactNode } from "react";

export default function ExamplesLayout({ children }: { children: ReactNode }) {
	return <>{children}</>;
}

// Force the example pages to be dynamic
export const dynamic = "force-dynamic";
