import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner Component', () => {
  test('renders the loading spinner', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('has accessible label', () => {
    render(<LoadingSpinner />);
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  test('renders three animated dots', () => {
    const { container } = render(<LoadingSpinner />);
    const dots = container.querySelectorAll('.animate-bounce');
    expect(dots).toHaveLength(3);
  });
});
