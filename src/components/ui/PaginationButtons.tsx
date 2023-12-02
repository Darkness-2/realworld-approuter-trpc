"use client";

import { Button, ButtonGroup } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { type ReactNode } from "react";

type PaginationButtonsProps = {
	currentPage: number;
	lastPage: number;
	firstPage?: number;
};

export default function PaginationButtons({ currentPage, lastPage, firstPage = 1 }: PaginationButtonsProps) {
	// Determine what page numbers to render
	const pagesToRender: number[] = [];

	if (currentPage - 2 >= firstPage) pagesToRender.push(currentPage - 2);
	if (currentPage - 1 >= firstPage) pagesToRender.push(currentPage - 1);
	pagesToRender.push(currentPage);
	if (currentPage + 1 <= lastPage) pagesToRender.push(currentPage + 1);
	if (currentPage + 2 <= lastPage) pagesToRender.push(currentPage + 2);

	return (
		<ButtonGroup isAttached>
			<PaginationButton page={firstPage}>{"<<"}</PaginationButton>
			{pagesToRender.map((page) => (
				<PaginationButton key={page} page={page} currentPage={currentPage === page}>
					{page}
				</PaginationButton>
			))}
			<PaginationButton page={lastPage}>{">>"}</PaginationButton>
		</ButtonGroup>
	);
}

type PaginationButtonProps = {
	children: ReactNode;
	page: number;
	currentPage?: boolean;
};

function PaginationButton({ children, page, currentPage = false }: PaginationButtonProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Generate new search params for the page, taking into account others that might already be set
	const newSearchParams = new URLSearchParams(searchParams);
	newSearchParams.set("page", page.toString());

	// Generate the href for the link
	const href = `${pathname}?${newSearchParams.toString()}`;

	return (
		<Button as={Link} href={href} size="sm" colorScheme={currentPage ? "green" : "gray"}>
			{children}
		</Button>
	);
}
