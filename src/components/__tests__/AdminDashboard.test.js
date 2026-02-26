import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../AdminDashboard';
import { authService } from '../../services/authService';
import { settingsService } from '../../services/settingsService';

jest.mock('../../services/authService');
jest.mock('../../services/settingsService');

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authService.isAdmin.mockReturnValue(true);
    authService.logout.mockImplementation(() => {});
    settingsService.getApiKey.mockReturnValue('test-api-key');
    settingsService.getAdminContext.mockReturnValue('test-context');
    settingsService.setApiKey.mockImplementation(() => {});
    settingsService.setAdminContext.mockImplementation(() => {});
  });

  test('renders the admin panel header', () => {
    renderWithRouter(<AdminDashboard />);
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  test('renders all navigation items', () => {
    renderWithRouter(<AdminDashboard />);
    const nav = screen.getByRole('navigation', { name: /admin navigation/i });
    // Check nav links within the admin navigation
    expect(nav.textContent).toMatch(/Dashboard/);
    expect(nav.textContent).toMatch(/Users/);
    expect(nav.textContent).toMatch(/Settings/);
  });

  test('renders logout button', () => {
    renderWithRouter(<AdminDashboard />);
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  test('calls authService.logout on logout click', () => {
    renderWithRouter(<AdminDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(authService.logout).toHaveBeenCalledTimes(1);
  });

  test('admin nav has accessible label', () => {
    renderWithRouter(<AdminDashboard />);
    expect(screen.getByRole('navigation', { name: /admin navigation/i })).toBeInTheDocument();
  });
});
