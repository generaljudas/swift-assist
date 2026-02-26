import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorDisplay from '../ErrorDisplay';

describe('ErrorDisplay Component', () => {
  test('renders nothing when message is empty', () => {
    const { container } = render(<ErrorDisplay message="" />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders nothing when message is null', () => {
    const { container } = render(<ErrorDisplay message={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders error message when provided', () => {
    render(<ErrorDisplay message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  test('has role="alert" for screen readers', () => {
    render(<ErrorDisplay message="An error occurred" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('has aria-live="assertive" for immediate announcement', () => {
    render(<ErrorDisplay message="Critical error" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });
});
