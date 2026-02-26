import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserDashboard from '../UserDashboard';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';

jest.mock('../../services/authService');
jest.mock('../../services/userService');

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('UserDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authService.logout.mockImplementation(() => {});
    authService.currentUserValue = { email: 'test@example.com', id: 1 };
    userService.getAllUsers = jest.fn(() => []);
    userService.updateUser = jest.fn();
  });

  test('renders the dashboard layout', () => {
    renderWithRouter(<UserDashboard />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  test('renders navigation tabs', () => {
    renderWithRouter(<UserDashboard />);
    const chatContextButtons = screen.getAllByText(/Chat Context/i);
    expect(chatContextButtons.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Add Tokens/i).length).toBeGreaterThan(0);
  });

  test('renders Chat Context tab content by default', () => {
    renderWithRouter(<UserDashboard />);
    // The textarea has the placeholder text
    expect(
      screen.getByPlaceholderText(/Enter context for the chat AI/i)
    ).toBeInTheDocument();
  });

  test('renders logout button', () => {
    renderWithRouter(<UserDashboard />);
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  test('calls authService.logout on logout button click', () => {
    renderWithRouter(<UserDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(authService.logout).toHaveBeenCalledTimes(1);
  });

  test('switches to Add Tokens tab on click', () => {
    renderWithRouter(<UserDashboard />);
    fireEvent.click(screen.getByText(/Add Tokens/i));
    expect(screen.getByText(/Current Balance/i)).toBeInTheDocument();
  });

  test('shows token purchase options in Add Tokens tab', () => {
    renderWithRouter(<UserDashboard />);
    fireEvent.click(screen.getByText(/Add Tokens/i));
    expect(screen.getByText('100 Tokens')).toBeInTheDocument();
    expect(screen.getByText('500 Tokens')).toBeInTheDocument();
    expect(screen.getByText('1000 Tokens')).toBeInTheDocument();
  });
});
