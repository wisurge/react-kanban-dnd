import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should render primary button by default', () => {
    render(<Button>Primary Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-600', 'text-white');
  });

  it('should render secondary button when variant is secondary', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-200', 'text-gray-900');
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small Button</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button size="lg">Large Button</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle hover states', () => {
    render(<Button>Hover Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-blue-700');
  });
});
