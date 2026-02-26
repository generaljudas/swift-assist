import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error for testing
const BrokenComponent = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Working fine</div>;
};

describe('ErrorBoundary Component', () => {
  // Suppress console.error for expected errors in tests
  let consoleSpy;
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Working fine')).toBeInTheDocument();
  });

  test('renders error UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  test('shows refresh button when error occurs', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument();
  });

  test('displays user-friendly error message', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText(/please refresh the page/i)).toBeInTheDocument();
  });
});
