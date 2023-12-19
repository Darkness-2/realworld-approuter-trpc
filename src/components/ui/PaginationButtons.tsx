"use client";

import { Button, ButtonGroup, Skeleton } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";

type PaginationMethod = "searchParam" | "pageParam";

type PaginationButtonsProps = {
	currentPage: number;
	lastPage: number;
	firstPage?: number;
	// To be used if the desired pathname is not the same as the page itself
	pathname?: string;
	// Specifies if the pagination is to use /pathname/[#] or /pathname?page=[#]
	method: PaginationMethod;
	// To be used if the desired search param is not "page"
	searchParam?: string;
};

export default function PaginationButtons({
	currentPage,
	lastPage,
	firstPage = 1,
	pathname,
	method,
	searchParam
}: PaginationButtonsProps) {
	// Determine what page numbers to render
	const pagesToRender: number[] = [];

	if (currentPage - 2 >= firstPage) pagesToRender.push(currentPage - 2);
	if (currentPage - 1 >= firstPage) pagesToRender.push(currentPage - 1);
	pagesToRender.push(currentPage);
	if (currentPage + 1 <= lastPage) pagesToRender.push(currentPage + 1);
	if (currentPage + 2 <= lastPage) pagesToRender.push(currentPage + 2);

	return (
		// Wrapped in suspense as useSearchParams defers rendering to client-side
		<Suspense fallback={<Skeleton h="32px" w="150px" />}>
			<ButtonGroup isAttached>
				<PaginationButton page={firstPage} pathname={pathname} method={method} searchParam={searchParam}>
					{"<<"}
				</PaginationButton>
				{pagesToRender.map((page) => (
					<PaginationButton
						key={page}
						page={page}
						currentPage={currentPage === page}
						pathname={pathname}
						method={method}
						searchParam={searchParam}
					>
						{page}
					</PaginationButton>
				))}
				<PaginationButton page={lastPage} pathname={pathname} method={method} searchParam={searchParam}>
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
	method: PaginationMethod;
	searchParam?: string;
};

function PaginationButton({
	children,
	page,
	currentPage = false,
	pathname,
	method,
	searchParam
}: PaginationButtonProps) {
	const actualPathname = usePathname();
	const searchParams = useSearchParams();

	// Use the actual pathname, unless pathname was provided as a prop
	const pathnameToUse = pathname ?? actualPathname;

	// Generate new search params for the page, taking into account others that might already be set
	const newSearchParams = new URLSearchParams(searchParams);
	newSearchParams.set(searchParam ?? "page", page.toString());

	// Generate the href for the link
	const href = method === "pageParam" ? `${pathnameToUse}/${page}` : `${pathnameToUse}?${newSearchParams.toString()}`;

	return (
		<Button as={Link} href={href} size="sm" colorScheme={currentPage ? "green" : "gray"}>
			{children}
		</Button>
	);
}
