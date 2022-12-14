import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom';
import Ratings from '../relatedItems/Ratings.jsx';
import MainCarousel from '../relatedItems/MainCarousel.jsx';

afterEach(() => {
  cleanup();
});

test('This should render product carousel component', () => {
  render(<Ratings rating={3} />);
  const element = screen.getByTestId('ratings');
});

test('This should render the main carousel component', () => {
  render(<MainCarousel id={40346} />);
  const element = screen.getByTestId('main');
  expect(element).toBeInTheDocument();
});
