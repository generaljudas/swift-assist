import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Contact from '../Contact';

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Contact Component', () => {
  test('renders contact page heading', () => {
    renderWithRouter(<Contact />);
    expect(screen.getByText(/contact swiftassist/i)).toBeInTheDocument();
  });

  test('renders home navigation link', () => {
    renderWithRouter(<Contact />);
    const homeLink = screen.getByRole('link', { name: /back to home page/i });
    expect(homeLink).toBeInTheDocument();
  });

  test('renders email contact information', () => {
    renderWithRouter(<Contact />);
    expect(screen.getByText('support@swiftassist.com')).toBeInTheDocument();
  });

  test('renders phone contact information', () => {
    renderWithRouter(<Contact />);
    expect(screen.getByText('+1 (800) 456-7890')).toBeInTheDocument();
  });

  test('renders office address', () => {
    renderWithRouter(<Contact />);
    expect(screen.getByText(/123 Innovation Drive/i)).toBeInTheDocument();
    expect(screen.getByText(/San Francisco/i)).toBeInTheDocument();
  });

  test('renders business hours section', () => {
    renderWithRouter(<Contact />);
    expect(screen.getByText(/Business Hours/i)).toBeInTheDocument();
    expect(screen.getByText(/Weekdays/i)).toBeInTheDocument();
  });

  test('renders email link with correct href', () => {
    renderWithRouter(<Contact />);
    const emailLink = screen.getByRole('link', { name: /support@swiftassist\.com/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:support@swiftassist.com');
  });

  test('renders phone link with correct href', () => {
    renderWithRouter(<Contact />);
    const phoneLink = screen.getByRole('link', { name: /\+1 \(800\) 456-7890/i });
    expect(phoneLink).toHaveAttribute('href', 'tel:+18004567890');
  });
});
