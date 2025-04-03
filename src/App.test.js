import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { authService } from './services/authService';

// Mock the auth service
jest.mock('./services/authService', () => ({
  authService: {
    isLoggedIn: jest.fn(),
    isAdmin: jest.fn(),
  }
}));

// Mock the React Router's useLocation hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({ pathname: '/', state: {} }),
}));

describe('App component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('shows login link when user is not logged in', () => {
    authService.isLoggedIn.mockReturnValue(false);
    
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
    
    const getStartedButton = screen.getByText(/get started/i);
    expect(getStartedButton).toBeInTheDocument();
    expect(getStartedButton.closest('a')).toHaveAttribute('href', '/login');
  });

  test('shows logout button when user is logged in', () => {
    authService.isLoggedIn.mockReturnValue(true);
    authService.isAdmin.mockReturnValue(false);
    
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
    
    const getStartedButton = screen.getByText(/get started/i);
    expect(getStartedButton).toBeInTheDocument();
    expect(getStartedButton.closest('a')).toHaveAttribute('href', '/chat');
  });

  test('shows admin dashboard link for admin users', () => {
    authService.isLoggedIn.mockReturnValue(true);
    authService.isAdmin.mockReturnValue(true);
    
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
  });
  
  test('renders the application video background', () => {
    authService.isLoggedIn.mockReturnValue(false);
    
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    const backgroundVideo = screen.getByTestId('background-video');
    expect(backgroundVideo).toBeInTheDocument();
    
    const videoSource = screen.getByTestId('video-source');
    expect(videoSource).toHaveAttribute('src', expect.stringContaining('background-video.mp4'));
  });
  
  test('renders contact link', () => {
    authService.isLoggedIn.mockReturnValue(false);
    
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
  });
});
