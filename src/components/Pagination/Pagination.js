import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import styles from './Pagination.module.css';
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPages = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, totalPages);
            }
            else if (currentPage >= totalPages - 2) {
                pages.push(1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            }
            else {
                pages.push(1, currentPage - 1, currentPage, currentPage + 1, totalPages);
            }
        }
        return pages;
    };
    const pages = getPages();
    return (_jsx("div", { className: styles.paginationContainer, children: pages.map((page, index) => (_jsxs(React.Fragment, { children: [_jsx("button", { className: currentPage === page ? styles.active : '', onClick: () => onPageChange(page), style: { cursor: 'pointer' }, children: page }), index < pages.length - 1 && pages[index + 1] !== page + 1 && (_jsx("span", { className: styles.ellipsis, children: "..." }))] }, page))) }));
};
export default Pagination;
