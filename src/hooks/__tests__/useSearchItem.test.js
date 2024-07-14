import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { render, screen, fireEvent } from '@testing-library/react';
import useSearchItem from '../useSearchItem';
const TestComponent = () => {
    const [searchItem, setSearchItem] = useSearchItem();
    return (_jsxs("div", { children: [_jsx("input", { value: searchItem, onChange: (e) => setSearchItem(e.target.value), placeholder: "Search Item" }), _jsx("p", { children: searchItem })] }));
};
describe('useSearchItem hook', () => {
    beforeEach(() => {
        localStorage.clear();
    });
    test('should initialize with value from localStorage', () => {
        localStorage.setItem('searchItem', 'pikachu');
        render(_jsx(TestComponent, {}));
        expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    });
    test('should update value and save to localStorage on unmount', () => {
        const { unmount } = render(_jsx(TestComponent, {}));
        const input = screen.getByPlaceholderText('Search Item');
        fireEvent.change(input, { target: { value: 'charizard' } });
        expect(screen.getByDisplayValue('charizard')).toBeInTheDocument();
        unmount();
        expect(localStorage.getItem('searchItem')).toBe('charizard');
    });
    test('should clear value in localStorage if input is empty', () => {
        const { unmount } = render(_jsx(TestComponent, {}));
        const input = screen.getByPlaceholderText('Search Item');
        fireEvent.change(input, { target: { value: '' } });
        expect(screen.getByDisplayValue('')).toBeInTheDocument();
        unmount();
        expect(localStorage.getItem('searchItem')).toBe('');
    });
});
