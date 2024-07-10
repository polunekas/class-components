import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Pagination.module.css";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
	const navigate = useNavigate();

	const handlePageChange = (page: number) => {
		onPageChange(page);
		navigate(`/?page=${page}`);
	};

	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

	return (
		<div className={styles.paginationContainer}>
			{pages.map((page) => (
				<button
					key={page}
					className={currentPage === page ? styles.active : ""}
					onClick={() => handlePageChange(page)}
				>
					{page}
				</button>
			))}
		</div>
	);
};

export default Pagination;
