import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from '@testing-library/react';
import SearchResults from '../SearchResults';
const mockPokemons = [
    {
        name: 'pikachu',
        height: 4,
        weight: 60,
        abilities: 'static, lightning-rod',
        types: 'electric',
    },
    {
        name: 'bulbasaur',
        height: 7,
        weight: 69,
        abilities: 'overgrow, chlorophyll',
        types: 'grass, poison',
    },
];
describe('SearchResults component', () => {
    test('renders the specified number of cards', () => {
        render(_jsx(SearchResults, { pokemons: mockPokemons, onCardClick: () => { }, searchItem: "" }));
        const cards = screen.getAllByRole('button');
        expect(cards).toHaveLength(mockPokemons.length);
    });
    test('displays appropriate message if no cards are present', () => {
        render(_jsx(SearchResults, { pokemons: [], onCardClick: () => { }, searchItem: "" }));
        expect(screen.getByText(/No pokemons found/i)).toBeInTheDocument();
    });
    test('renders searchItem specific card', () => {
        render(_jsx(SearchResults, { pokemons: [mockPokemons[0]], onCardClick: () => { }, searchItem: "pikachu" }));
        expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });
    test('calls onCardClick when card is clicked', () => {
        const handleCardClick = jest.fn();
        render(_jsx(SearchResults, { pokemons: mockPokemons, onCardClick: handleCardClick, searchItem: "" }));
        fireEvent.click(screen.getByText(/pikachu/i));
        expect(handleCardClick).toHaveBeenCalledWith(mockPokemons[0]);
    });
});
