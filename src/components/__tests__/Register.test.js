import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from '../Register';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';

jest.mock('../../services/authService');
jest.mock('../../services/userService');

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  test('validates email confirmation', async () => {
    renderWithRouter(<SignUp />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/confirm email/i), {
      target: { value: 'different@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/emails do not match/i);
  });

  test('calls register on successful submit', async () => {
    authService.register.mockResolvedValue({});
    userService.addUser.mockResolvedValue({});

    renderWithRouter(<SignUp />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/confirm email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith(
        'testuser',
        'user@example.com',
        'password123'
      );
    });
  });
});
