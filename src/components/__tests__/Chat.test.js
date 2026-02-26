import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Chat from '../Chat';
import { chatService } from '../../services/chatService';
import { authService } from '../../services/authService';
import { settingsService } from '../../services/settingsService';

jest.mock('../../services/chatService');
jest.mock('../../services/authService');
jest.mock('../../services/settingsService');

describe('Chat Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    authService.getUser.mockReturnValue({ id: 1 });
    authService.isAdmin.mockReturnValue(false);
    settingsService.getApiKey.mockReturnValue('test-key');
    settingsService.getContextForUser.mockReturnValue('');
  });

  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  test('renders initial assistant greeting when API key is set', () => {
    renderWithRouter(<Chat />);

    expect(screen.getByText(/hello! welcome to swift assist/i)).toBeInTheDocument();
  });

  test('sends message and shows assistant response', async () => {
    chatService.sendMessage.mockResolvedValue('Test response');

    renderWithRouter(<Chat />);

    const input = screen.getByLabelText(/chat message/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    const responseMessage = await screen.findByText('Test response');
    expect(responseMessage).toBeInTheDocument();
    expect(chatService.sendMessage).toHaveBeenCalled();
  });
});
