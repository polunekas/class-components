import React from 'react';
import { render } from '@testing-library/react';
import Loader from '../Loader';

describe('Loader component', () => {
  test('renders loader', () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toHaveClass('loaderContainer');
  });
});
