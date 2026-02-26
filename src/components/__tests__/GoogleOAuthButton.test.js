import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GoogleOAuthButton from '../GoogleOAuthButton';
import { authService } from '../../services/authService';

jest.mock('../../services/authService');

describe('GoogleOAuthButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the Google sign in button', () => {
    render(<GoogleOAuthButton />);
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  test('button has type="button" to prevent form submission', () => {
    render(<GoogleOAuthButton />);
    expect(screen.getByRole('button', { name: /sign in with google/i })).toHaveAttribute(
      'type',
      'button'
    );
  });

  test('calls authService.signInWithGoogle on click', async () => {
    authService.signInWithGoogle.mockResolvedValue({});
    const onSuccess = jest.fn();

    render(<GoogleOAuthButton onSuccess={onSuccess} />);
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));

    await waitFor(() => {
      expect(authService.signInWithGoogle).toHaveBeenCalledTimes(1);
    });
  });

  test('calls onError callback when sign in fails', async () => {
    const error = new Error('Sign in failed');
    authService.signInWithGoogle.mockRejectedValue(error);
    const onError = jest.fn();

    render(<GoogleOAuthButton onError={onError} />);
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  test('accepts custom className prop', () => {
    render(<GoogleOAuthButton className="custom-class" />);
    const button = screen.getByRole('button', { name: /sign in with google/i });
    expect(button.className).toContain('custom-class');
  });

  test('SVG icon is aria-hidden for screen readers', () => {
    const { container } = render(<GoogleOAuthButton />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
