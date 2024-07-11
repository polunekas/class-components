import React from "react";
import styles from "./Pagination.module.css";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
}) => {
	const getPages = () => {
		const pages = [];
		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (currentPage <= 3) {
				pages.push(1, 2, 3, 4, totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
			} else {
				pages.push(1, currentPage - 1, currentPage, currentPage + 1, totalPages);
			}
		}
		return pages;
	};

	const pages = getPages();

	return (
		<div className={styles.paginationContainer}>
			{pages.map((page, index) => (
				<React.Fragment key={page}>
					<button
						className={currentPage === page ? styles.active : ""}
						onClick={() => onPageChange(page)}
					>
						{page}
					</button>
					{index < pages.length - 1 && pages[index + 1] !== page + 1 && (
						<span className={styles.ellipsis}>...</span>
					)}
				</React.Fragment>
			))}
		</div>
	);
};

export default Pagination;
