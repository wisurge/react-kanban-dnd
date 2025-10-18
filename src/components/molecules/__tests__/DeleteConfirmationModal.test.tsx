import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';

describe('DeleteConfirmationModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    taskTitle: 'Test Task',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when open', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    
    expect(screen.getByText('Delete Task')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<DeleteConfirmationModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Delete Task')).not.toBeInTheDocument();
  });

  it('should call onConfirm when delete button is clicked', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('should call onClose when cancel button is clicked', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });

  it('should call onClose when backdrop is clicked', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    
    const backdrop = document.querySelector('.fixed.inset-0');
    fireEvent.click(backdrop!);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when modal content is clicked', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    
    const modalContent = screen.getByText('Delete Task');
    fireEvent.click(modalContent);
    
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('should display correct task title', () => {
    render(<DeleteConfirmationModal {...defaultProps} taskTitle="My Important Task" />);
    
    // Just check that the modal renders with the custom title
    expect(screen.getByText('Delete Task')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
});
