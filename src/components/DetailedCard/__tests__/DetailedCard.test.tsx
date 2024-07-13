import React from 'react';
import { render, screen } from '@testing-library/react';
import DetailedCard from '../DetailedCard';

const mockPokemon = {
	name: 'pikachu',
	height: 4,
	weight: 60,
	abilities: 'static, lightning-rod',
	types: 'electric',
};

describe('DetailedCard component', () => {
	test('displays detailed card data', () => {
		render(<DetailedCard pokemon={mockPokemon} />);
		expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
		expect(screen.getByText(/Height: 4/i)).toBeInTheDocument();
		expect(screen.getByText(/Weight: 60/i)).toBeInTheDocument();
		expect(screen.getByText(/Abilities: static, lightning-rod/i)).toBeInTheDocument();
		expect(screen.getByText(/Types: electric/i)).toBeInTheDocument();
	});

	test('renders nothing when pokemon data is not provided', () => {
		const { container } = render(<DetailedCard pokemon={null} />);
		expect(container.firstChild).toBeNull();
	});
});
