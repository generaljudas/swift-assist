import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { authService } from './services/authService';

jest.mock('./services/authService', () => ({
  authService: {
    isLoggedIn: jest.fn(),
    isAdmin: jest.fn(),
    getUser: jest.fn(() => null),
    logout: jest.fn(),
    handleAuthCallback: jest.fn(),
  },
}));

jest.mock('./services/chatService', () => ({
  chatService: {
    setApiKey: jest.fn(),
    sendMessage: jest.fn(),
  },
}));

jest.mock('./services/settingsService', () => ({
  settingsService: {
    getApiKey: jest.fn(() => 'test-key'),
    getContextForUser: jest.fn(() => ''),
    getSettings: jest.fn(() => ({})),
  },
}));

jest.mock('./services/databaseService', () => ({
  databaseService: {
    init: jest.fn(),
    getUsers: jest.fn(() => []),
  },
}));

jest.mock('./components/Login', () => () => <div data-testid="mock-login-page" />);
jest.mock('./components/Register', () => () => <div data-testid="mock-register-page" />);
jest.mock('./components/Chat', () => () => <div data-testid="mock-chat-page" />);
jest.mock('./components/AdminDashboard', () => () => <div data-testid="mock-admin-page" />);
jest.mock('./components/UserDashboard', () => () => <div data-testid="mock-dashboard-page" />);
jest.mock('./components/Contact', () => () => <div data-testid="mock-contact-page" />);

jest.mock('./services/userService', () => ({
  userService: {
    getUsers: jest.fn(() => []),
    getUser: jest.fn(),
    addUser: jest.fn(),
    updateUser: jest.fn(),
    removeUser: jest.fn(),
    addTokens: jest.fn(),
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

  test('shows login link and CTA to login when user is not logged in', async () => {
    authService.isLoggedIn.mockReturnValue(false);
    authService.isAdmin.mockReturnValue(false);

    renderApp();

    expect(await screen.findByText(/login/i)).toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();

    const getStartedLink = screen.getByRole('link', { name: /get started/i });
    expect(getStartedLink).toHaveAttribute('href', '/login');
  });

  test('shows logout button and CTA to chat when regular user is logged in', async () => {
    authService.isLoggedIn.mockReturnValue(true);
    authService.isAdmin.mockReturnValue(false);

    renderApp();

    expect(await screen.findByText(/logout/i)).toBeInTheDocument();
    expect(screen.queryByText(/^login$/i)).not.toBeInTheDocument();

    const getStartedLink = screen.getByRole('link', { name: /get started/i });
    expect(getStartedLink).toHaveAttribute('href', '/chat');
  });

  test('shows admin dashboard link and CTA to admin when admin is logged in', async () => {
    authService.isLoggedIn.mockReturnValue(true);
    authService.isAdmin.mockReturnValue(true);

    renderApp();

    expect(await screen.findByText(/admin dashboard/i)).toBeInTheDocument();

    const getStartedLink = screen.getByRole('link', { name: /get started/i });
    expect(getStartedLink).toHaveAttribute('href', '/admin');
  });

  test('renders the application video background', async () => {
    authService.isLoggedIn.mockReturnValue(false);
    authService.isAdmin.mockReturnValue(false);

    renderApp();

    const backgroundVideo = await screen.findByTestId('background');
    expect(backgroundVideo).toBeInTheDocument();

    const videoSource = screen.getByTestId('video-source');
    expect(videoSource).toHaveAttribute('src', expect.stringContaining('background.mp4'));
  });

  test('renders contact link in navigation', async () => {
    authService.isLoggedIn.mockReturnValue(false);
    authService.isAdmin.mockReturnValue(false);

    renderApp();

    expect(await screen.findByText(/contact/i)).toBeInTheDocument();
  });
});
