"use client";

import { Button, ButtonGroup, Skeleton } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";

type PaginationButtonsProps = {
	currentPage: number;
	lastPage: number;
	firstPage?: number;
	// To be used if the desired pathname is not the same as the page itself
	pathname?: string;
};

export default function PaginationButtons({ currentPage, lastPage, firstPage = 1, pathname }: PaginationButtonsProps) {
	// Determine what page numbers to render
	const pagesToRender: number[] = [];

	if (currentPage - 2 >= firstPage) pagesToRender.push(currentPage - 2);
	if (currentPage - 1 >= firstPage) pagesToRender.push(currentPage - 1);
	pagesToRender.push(currentPage);
	if (currentPage + 1 <= lastPage) pagesToRender.push(currentPage + 1);
	if (currentPage + 2 <= lastPage) pagesToRender.push(currentPage + 2);

	return (
		// Wrapped in suspense as useSearchParams defers rendering to client-side
		// Todo: Create loading state for this
		<Suspense fallback={<Skeleton h="32px" w="150px" />}>
			<ButtonGroup isAttached>
				<PaginationButton page={firstPage} pathname={pathname}>
					{"<<"}
				</PaginationButton>
				{pagesToRender.map((page) => (
					<PaginationButton key={page} page={page} currentPage={currentPage === page} pathname={pathname}>
						{page}
					</PaginationButton>
				))}
				<PaginationButton page={lastPage} pathname={pathname}>
					{">>"}
				</PaginationButton>
			</ButtonGroup>
		</Suspense>
	);
}

type PaginationButtonProps = {
	children: ReactNode;
	page: number;
	currentPage?: boolean;
	pathname?: string;
};

function PaginationButton({ children, page, currentPage = false, pathname }: PaginationButtonProps) {
	const actualPathname = usePathname();
	const searchParams = useSearchParams();

	// Generate new search params for the page, taking into account others that might already be set
	const newSearchParams = new URLSearchParams(searchParams);
	newSearchParams.set("page", page.toString());

	// Generate the href for the link
	const href = `${pathname ?? actualPathname}?${newSearchParams.toString()}`;

	return (
		<Button as={Link} href={href} size="sm" colorScheme={currentPage ? "green" : "gray"}>
			{children}
		</Button>
	);
}
