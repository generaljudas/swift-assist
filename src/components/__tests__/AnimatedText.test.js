import React from 'react';
import { render, screen, act } from '@testing-library/react';
import AnimatedText from '../AnimatedText';

describe('AnimatedText Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders the first word initially', () => {
    render(<AnimatedText />);
    expect(screen.getByText('Answers')).toBeInTheDocument();
  });

  test('renders the tagline text', () => {
    render(<AnimatedText />);
    expect(
      screen.getByText(/zero training for customers/i)
    ).toBeInTheDocument();
  });

  test('cycles to next word after 1 second', () => {
    render(<AnimatedText />);
    expect(screen.getByText('Answers')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Bookings')).toBeInTheDocument();
  });

  test('cycles through all words', () => {
    render(<AnimatedText />);
    const words = ['Answers', 'Bookings', 'Payments', 'Deadlines', 'Solutions'];

    words.forEach((word, i) => {
      if (i > 0) {
        act(() => {
          jest.advanceTimersByTime(1000);
        });
      }
      expect(screen.getByText(word)).toBeInTheDocument();
    });
  });

  test('loops back to first word after all words shown', () => {
    render(<AnimatedText />);

    act(() => {
      jest.advanceTimersByTime(5000); // 5 words × 1000ms
    });

    expect(screen.getByText('Answers')).toBeInTheDocument();
  });
});
