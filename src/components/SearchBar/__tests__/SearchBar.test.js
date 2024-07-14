import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';
import useSearchItem from '../../../hooks/useSearchItem';
jest.mock('../../../hooks/useSearchItem');
describe('SearchBar component', () => {
    test('renders input and search button', () => {
        useSearchItem.mockReturnValue(['', jest.fn()]);
        render(_jsx(SearchBar, { fromSearch: () => { } }));
        expect(screen.getByPlaceholderText('pikachu')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });
    test('calls fromSearch with the input value when the search button is clicked', () => {
        const fromSearch = jest.fn();
        useSearchItem.mockReturnValue(['', jest.fn()]);
        render(_jsx(SearchBar, { fromSearch: fromSearch }));
        const input = screen.getByPlaceholderText('pikachu');
        fireEvent.change(input, { target: { value: 'charizard' } });
        fireEvent.click(screen.getByRole('button', { name: /search/i }));
        expect(fromSearch).toHaveBeenCalledWith('charizard');
    });
    test('updates the input value based on useSearchItem hook', () => {
        useSearchItem.mockReturnValue(['charizard', jest.fn()]);
        render(_jsx(SearchBar, { fromSearch: () => { } }));
        expect(screen.getByDisplayValue('charizard')).toBeInTheDocument();
    });
    test('saves the entered value to local storage when search button is clicked', () => {
        const setSearchItem = jest.fn();
        useSearchItem.mockReturnValue(['', setSearchItem]);
        render(_jsx(SearchBar, { fromSearch: () => { } }));
        const input = screen.getByPlaceholderText('pikachu');
        fireEvent.change(input, { target: { value: 'charizard' } });
        fireEvent.click(screen.getByRole('button', { name: /search/i }));
        expect(setSearchItem).toHaveBeenCalledWith('charizard');
    });
});
