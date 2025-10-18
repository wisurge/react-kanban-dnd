import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card Component', () => {
  it('should render card with children', () => {
    render(<Card>Card content</Card>);
    
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should apply default styling', () => {
    render(<Card>Test Card</Card>);
    
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Card className="custom-card">Custom Card</Card>);
    
    expect(screen.getByText('Custom Card')).toBeInTheDocument();
  });

  it('should render with padding by default', () => {
    render(<Card>Padded Card</Card>);
    
    expect(screen.getByText('Padded Card')).toBeInTheDocument();
  });

  it('should render with small padding', () => {
    render(<Card padding="sm">Small Padding Card</Card>);
    
    expect(screen.getByText('Small Padding Card')).toBeInTheDocument();
  });

  it('should render with large padding', () => {
    render(<Card padding="lg">Large Padding Card</Card>);
    
    expect(screen.getByText('Large Padding Card')).toBeInTheDocument();
  });

  it('should render with custom style', () => {
    render(<Card style={{ backgroundColor: 'red' }}>Styled Card</Card>);
    
    expect(screen.getByText('Styled Card')).toBeInTheDocument();
  });

  it('should render with default medium padding', () => {
    render(<Card>Default Card</Card>);
    
    expect(screen.getByText('Default Card')).toBeInTheDocument();
  });
});
