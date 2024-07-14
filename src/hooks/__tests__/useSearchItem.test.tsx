import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import useSearchItem from '../useSearchItem';

const TestComponent: React.FC = () => {
	const [searchItem, setSearchItem] = useSearchItem();
	return (
		<div>
			<input
				value={searchItem}
				onChange={(e) => setSearchItem(e.target.value)}
				placeholder="Search Item"
			/>
			<p>{searchItem}</p>
		</div>
	);
};

describe('useSearchItem hook', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	test('should initialize with value from localStorage', () => {
		localStorage.setItem('searchItem', 'pikachu');
		render(<TestComponent />);
		expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
	});

	test('should update value and save to localStorage on unmount', () => {
		const { unmount } = render(<TestComponent />);
		const input = screen.getByPlaceholderText('Search Item');

		fireEvent.change(input, { target: { value: 'charizard' } });
		expect(screen.getByDisplayValue('charizard')).toBeInTheDocument();

		unmount();
		expect(localStorage.getItem('searchItem')).toBe('charizard');
	});

	test('should clear value in localStorage if input is empty', () => {
		const { unmount } = render(<TestComponent />);
		const input = screen.getByPlaceholderText('Search Item');

		fireEvent.change(input, { target: { value: '' } });
		expect(screen.getByDisplayValue('')).toBeInTheDocument();

		unmount();
		expect(localStorage.getItem('searchItem')).toBe('');
	});
});
