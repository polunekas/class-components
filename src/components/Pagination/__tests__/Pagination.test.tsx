import { render, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination';

test('renders pagination correctly', () => {
	const { getByText } = render(<Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />);
	expect(getByText('1')).toBeInTheDocument();
	expect(getByText('2')).toBeInTheDocument();
	expect(getByText('3')).toBeInTheDocument();
	expect(getByText('4')).toBeInTheDocument();
	expect(getByText('5')).toBeInTheDocument();
});

test('calls onPageChange with the correct page number when a page is clicked', () => {
	const onPageChangeMock = jest.fn();
	const { getByText } = render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChangeMock} />);
	fireEvent.click(getByText('3'));
	expect(onPageChangeMock).toHaveBeenCalledWith(3);
});
