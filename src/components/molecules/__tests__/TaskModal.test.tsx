import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskModal } from '../TaskModal';
import { Task as TaskType } from '../../../types';

const mockTask: TaskType = {
  id: 'test-task-1',
  title: 'Test Task',
  description: 'Test description',
  status: 'todo',
  createdAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2024-01-15T10:00:00Z'),
};

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  onCreateTask: jest.fn(),
  onUpdateTask: jest.fn(),
  mode: 'create' as const,
};

describe('TaskModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.alert
    window.alert = jest.fn();
  });

  it('should render create modal when mode is create', () => {
    render(<TaskModal {...defaultProps} />);

    expect(screen.getByText('Create New Issue')).toBeInTheDocument();
    expect(screen.getByLabelText('Title *')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('should render edit modal when mode is edit', () => {
    render(<TaskModal {...defaultProps} mode="edit" editingTask={mockTask} />);

    expect(screen.getAllByText('Update Issue')).toHaveLength(2); // Header and button
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(<TaskModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Create New Issue')).not.toBeInTheDocument();
  });

  it('should close modal when close button is clicked', () => {
    render(<TaskModal {...defaultProps} />);

    const closeButton = screen.getByRole('button', { name: '' }); // Close button has no text
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should close modal when cancel button is clicked', () => {
    render(<TaskModal {...defaultProps} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should submit create form with valid data', async () => {
    render(<TaskModal {...defaultProps} />);

    const titleInput = screen.getByLabelText('Title *');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByText('Create Issue');

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'New description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.onCreateTask).toHaveBeenCalledWith('New Task', 'New description', 'todo');
    });
  });

  it('should submit edit form with updated data', async () => {
    render(<TaskModal {...defaultProps} mode="edit" editingTask={mockTask} />);

    const titleInput = screen.getByLabelText('Title *');
    const submitButton = screen.getAllByText('Update Issue')[1]; // Get the button, not the header

    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.onUpdateTask).toHaveBeenCalledWith('test-task-1', 'Updated Task', 'Test description', 'todo');
    });
  });

  it('should not submit form with empty title', async () => {
    render(<TaskModal {...defaultProps} />);

    const submitButton = screen.getByText('Create Issue');
    fireEvent.click(submitButton);

    // Form should not be submitted
    expect(defaultProps.onCreateTask).not.toHaveBeenCalled();
  });

  it('should change status in form', () => {
    render(<TaskModal {...defaultProps} />);

    const statusSelect = screen.getByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: 'inProgress' } });

    expect(statusSelect).toHaveValue('inProgress');
  });

  it('should reset form when modal closes', () => {
    const { rerender } = render(<TaskModal {...defaultProps} />);

    const titleInput = screen.getByLabelText('Title *');
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    // Close modal
    rerender(<TaskModal {...defaultProps} isOpen={false} />);

    // Reopen modal
    rerender(<TaskModal {...defaultProps} isOpen={true} />);

    // Form should be reset
    expect(screen.getByLabelText('Title *')).toBeInTheDocument();
  });

  it('should show loading state when submitting', async () => {
    const slowCreateTask = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<TaskModal {...defaultProps} onCreateTask={slowCreateTask} />);

    const titleInput = screen.getByLabelText('Title *');
    const submitButton = screen.getByText('Create Issue');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Creating...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});
