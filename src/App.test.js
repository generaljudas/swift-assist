import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { authService } from './services/authService';

jest.mock('./services/authService', () => ({
  authService: {
    isLoggedIn: jest.fn(),
    isAdmin: jest.fn(),
  },
}));

describe('App component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderApp = () =>
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

  test('shows login link and CTA to login when user is not logged in', () => {
    authService.isLoggedIn.mockReturnValue(false);
    authService.isAdmin.mockReturnValue(false);

    renderApp();

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();

    const getStartedLink = screen.getByRole('link', { name: /get started/i });
    expect(getStartedLink).toHaveAttribute('href', '/login');
  });

  test('shows logout button and CTA to chat when regular user is logged in', () => {
    authService.isLoggedIn.mockReturnValue(true);
    authService.isAdmin.mockReturnValue(false);

    renderApp();

    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    expect(screen.queryByText(/login/i)).not.toBeInTheDocument();

    const getStartedLink = screen.getByRole('link', { name: /get started/i });
    expect(getStartedLink).toHaveAttribute('href', '/chat');
  });

  test('shows admin dashboard link and CTA to admin when admin is logged in', () => {
    authService.isLoggedIn.mockReturnValue(true);
    authService.isAdmin.mockReturnValue(true);

    renderApp();

    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();

    const getStartedLink = screen.getByRole('link', { name: /get started/i });
    expect(getStartedLink).toHaveAttribute('href', '/admin');
  });

  test('renders the application video background', () => {
    authService.isLoggedIn.mockReturnValue(false);
    authService.isAdmin.mockReturnValue(false);

    renderApp();

    const backgroundVideo = screen.getByTestId('background');
    expect(backgroundVideo).toBeInTheDocument();

    const videoSource = screen.getByTestId('video-source');
    expect(videoSource).toHaveAttribute('src', expect.stringContaining('background.mp4'));
  });

  test('renders contact link in navigation', () => {
    authService.isLoggedIn.mockReturnValue(false);
    authService.isAdmin.mockReturnValue(false);

    renderApp();

    expect(screen.getByText(/contact/i)).toBeInTheDocument();
  });
});
