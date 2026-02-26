import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsForm from '../SettingsForm';

describe('SettingsForm Component', () => {
  const defaultProps = {
    apiKey: '',
    setApiKey: jest.fn(),
    adminContext: '',
    setAdminContext: jest.fn(),
    showApiKey: false,
    setShowApiKey: jest.fn(),
    saveStatus: '',
    handleSave: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the settings form', () => {
    render(<SettingsForm {...defaultProps} />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('renders API key input field', () => {
    render(<SettingsForm {...defaultProps} />);
    expect(screen.getByLabelText(/openai api key/i)).toBeInTheDocument();
  });

  test('renders chat context textarea', () => {
    render(<SettingsForm {...defaultProps} />);
    expect(screen.getByLabelText(/chat context/i)).toBeInTheDocument();
  });

  test('renders save button', () => {
    render(<SettingsForm {...defaultProps} />);
    expect(screen.getByRole('button', { name: /save settings/i })).toBeInTheDocument();
  });

  test('API key input is type password by default', () => {
    render(<SettingsForm {...defaultProps} showApiKey={false} />);
    const apiInput = screen.getByLabelText(/openai api key/i);
    expect(apiInput).toHaveAttribute('type', 'password');
  });

  test('API key input is type text when showApiKey is true', () => {
    render(<SettingsForm {...defaultProps} showApiKey={true} />);
    const apiInput = screen.getByLabelText(/openai api key/i);
    expect(apiInput).toHaveAttribute('type', 'text');
  });

  test('show/hide button toggles API key visibility', () => {
    render(<SettingsForm {...defaultProps} />);
    const toggleBtn = screen.getByRole('button', { name: /show api key/i });
    fireEvent.click(toggleBtn);
    expect(defaultProps.setShowApiKey).toHaveBeenCalledWith(true);
  });

  test('calls handleSave on form submit', () => {
    render(<SettingsForm {...defaultProps} />);
    fireEvent.submit(screen.getByRole('button', { name: /save settings/i }).closest('form'));
    expect(defaultProps.handleSave).toHaveBeenCalled();
  });

  test('displays success save status', () => {
    render(<SettingsForm {...defaultProps} saveStatus="Settings saved successfully!" />);
    expect(screen.getByText('Settings saved successfully!')).toBeInTheDocument();
  });

  test('displays error save status', () => {
    render(<SettingsForm {...defaultProps} saveStatus="Error saving settings: test" />);
    const statusMsg = screen.getByRole('status');
    expect(statusMsg).toHaveTextContent(/Error saving settings/i);
  });

  test('calls setApiKey when API key input changes', () => {
    render(<SettingsForm {...defaultProps} />);
    const apiInput = screen.getByLabelText(/openai api key/i);
    fireEvent.change(apiInput, { target: { value: 'sk-test-key' } });
    expect(defaultProps.setApiKey).toHaveBeenCalledWith('sk-test-key');
  });

  test('calls setAdminContext when context textarea changes', () => {
    render(<SettingsForm {...defaultProps} />);
    const contextInput = screen.getByLabelText(/chat context/i);
    fireEvent.change(contextInput, { target: { value: 'New context' } });
    expect(defaultProps.setAdminContext).toHaveBeenCalledWith('New context');
  });
});
