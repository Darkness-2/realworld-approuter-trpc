"use client";

import Link from "$/components/ui/Link";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

type PaginationButtonsProps = {
	currentPage: number;
	lastPage: number;
	firstPage?: number;
};

export default function PaginationButtons({ currentPage, lastPage, firstPage = 1 }: PaginationButtonsProps) {
	const pathname = usePathname();

	// Determine what page numbers to render
	const pagesToRender: number[] = [];

	if (currentPage - 2 >= firstPage) pagesToRender.push(currentPage - 2);
	if (currentPage - 1 >= firstPage) pagesToRender.push(currentPage - 1);
	pagesToRender.push(currentPage);
	if (currentPage + 1 <= lastPage) pagesToRender.push(currentPage + 1);
	if (currentPage + 2 <= lastPage) pagesToRender.push(currentPage + 2);

	return (
		<ButtonGroup isAttached>
			<PaginationButton href={`${pathname}?page=${firstPage}`}>{"<<"}</PaginationButton>
			{pagesToRender.map((page) => (
				<PaginationButton key={page} href={`${pathname}?page=${page}`} currentPage={currentPage === page}>
					{page}
				</PaginationButton>
			))}
			<PaginationButton href={`${pathname}?page=${lastPage}`}>{">>"}</PaginationButton>
		</ButtonGroup>
	);
}

type PaginationButtonProps = {
	children: ReactNode;
	href: string;
	currentPage?: boolean;
};

function PaginationButton({ children, href, currentPage = false }: PaginationButtonProps) {
	return (
		<Button as={Link} href={href} size="sm" colorScheme={currentPage ? "green" : "gray"}>
			{children}
		</Button>
	);
}
