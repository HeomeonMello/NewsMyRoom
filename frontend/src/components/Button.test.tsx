import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders the button with the correct text', () => {
  render(<Button text="Click me" onClick={() => {}} />);
  const buttonElement = screen.getByText(/Click me/i);
  expect(buttonElement).toBeInTheDocument();
});
