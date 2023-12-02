"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Todo: Style this page
export default function NotFoundPage() {
	const router = useRouter();

	useEffect(() => {
		console.log("router refresh happened");
		router.refresh();
	}, [router]);

	return <div>NotFoundPage</div>;
}
