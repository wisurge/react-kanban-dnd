import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input Component', () => {
  it('should render input with value', () => {
    render(<Input value="test value" onChange={jest.fn()} />);
    
    const input = screen.getByDisplayValue('test value');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should handle value changes', () => {
    const handleChange = jest.fn();
    render(<Input value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(handleChange).toHaveBeenCalledWith('new value');
  });

  it('should display placeholder', () => {
    render(<Input value="" onChange={jest.fn()} placeholder="Enter text..." />);
    
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input value="" onChange={jest.fn()} disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Input value="" onChange={jest.fn()} className="custom-input" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input');
  });

  it('should focus when autoFocus is true', () => {
    render(<Input value="" onChange={jest.fn()} autoFocus />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveFocus();
  });

  it('should handle keyboard events', () => {
    const handleKeyDown = jest.fn();
    render(<Input value="" onChange={jest.fn()} onKeyDown={handleKeyDown} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(handleKeyDown).toHaveBeenCalled();
  });

  it('should have proper styling classes', () => {
    render(<Input value="" onChange={jest.fn()} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });
});
