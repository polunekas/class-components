import { jsx as _jsx } from "react/jsx-runtime";
import { render } from '@testing-library/react';
import DetailedCard from '../DetailedCard';
const mockPokemon = {
    name: 'pikachu',
    height: 4,
    weight: 60,
    abilities: 'static, lightning-rod',
    types: 'electric'
};
describe('DetailedCard', () => {
    it('renders pokemon details correctly', () => {
        const { getByText } = render(_jsx(DetailedCard, { pokemon: mockPokemon, onClose: () => { } }));
        expect(getByText(/pikachu/i)).toBeInTheDocument();
        expect(getByText(/Height: 4/i)).toBeInTheDocument();
        expect(getByText(/Weight: 60/i)).toBeInTheDocument();
        expect(getByText(/Abilities: static, lightning-rod/i)).toBeInTheDocument();
        expect(getByText(/Types: electric/i)).toBeInTheDocument();
    });
    it('renders nothing when no pokemon is provided', () => {
        const { container } = render(_jsx(DetailedCard, { pokemon: null, onClose: () => { } }));
        expect(container.firstChild).toBeNull();
    });
});
