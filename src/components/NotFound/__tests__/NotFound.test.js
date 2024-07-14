import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import NotFound from '../NotFound';
describe('NotFound component', () => {
    test('renders 404 message', () => {
        render(_jsx(NotFound, {}));
        expect(screen.getByText(/404 - Page Not Found/i)).toBeInTheDocument();
        expect(screen.getByText(/Sorry, the page you are looking for does not exist./i)).toBeInTheDocument();
    });
});
