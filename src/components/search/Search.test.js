import { render, screen } from '@testing-library/react';
import Search from './Search';

it('Displays search for books', () => {
  render(<Search />);
  const text = screen.getByText('Search for books');
  expect(text).toBeInTheDocument();
});
