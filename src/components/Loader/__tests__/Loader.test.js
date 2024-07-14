import { jsx as _jsx } from "react/jsx-runtime";
import { render } from '@testing-library/react';
import Loader from '../Loader';
describe('Loader component', () => {
    test('renders loader', () => {
        const { container } = render(_jsx(Loader, {}));
        expect(container.firstChild).toHaveClass('loaderContainer');
    });
});
