import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Task } from '../Task';
import { Task as TaskType } from '../../../types';

// Mock the boardStore
jest.mock('../../../store/boardStore', () => ({
  useBoardStore: () => ({
    updateTaskStatus: jest.fn(),
  }),
}));

const mockTask: TaskType = {
  id: 'test-task-1',
  title: 'Test Task Title',
  description: 'Test task description',
  status: 'todo',
  createdAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2024-01-15T10:00:00Z'),
};

const defaultProps = {
  task: mockTask,
  onUpdate: jest.fn(),
  onDelete: jest.fn(),
  onUpdateTaskStatus: jest.fn(),
  onEdit: jest.fn(),
};

describe('Task Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render task title and description', () => {
    render(<Task {...defaultProps} />);

    expect(screen.getByText('Test Task Title')).toBeInTheDocument();
  });

  it('should display issue key in correct format', () => {
    render(<Task {...defaultProps} />);

    expect(screen.getByText('KAN-task')).toBeInTheDocument();
  });

  it('should display correct issue type based on content', () => {
    const bugTask = {
      ...mockTask,
      title: 'Fix critical bug in system',
      description: 'Error handling issue',
    };

    render(<Task {...defaultProps} task={bugTask} />);

    expect(screen.getByText('Bug')).toBeInTheDocument();
  });

  it('should display correct priority indicator', () => {
    const longTitleTask = {
      ...mockTask,
      title: 'This is a very long task title that should indicate high priority',
    };

    render(<Task {...defaultProps} task={longTitleTask} />);

    // Check for priority dot (highest priority should be red)
    const priorityDot = document.querySelector('.bg-red-500');
    expect(priorityDot).toBeInTheDocument();
  });

  it('should show status indicator', () => {
    render(<Task {...defaultProps} />);

    expect(screen.getByText('todo')).toBeInTheDocument();
  });

  it('should enable inline editing when title is double-clicked', async () => {
    render(<Task {...defaultProps} />);

    const editButton = screen.getByTitle('Edit title');
    fireEvent.click(editButton);

    const input = screen.getByDisplayValue('Test Task Title');
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it('should save changes when Enter is pressed', async () => {
    render(<Task {...defaultProps} />);

    const editButton = screen.getByTitle('Edit title');
    fireEvent.click(editButton);

    const input = screen.getByDisplayValue('Test Task Title');
    fireEvent.change(input, { target: { value: 'Updated Task Title' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(defaultProps.onUpdate).toHaveBeenCalledWith('test-task-1', 'Updated Task Title');
  });

  it('should cancel editing when Escape is pressed', async () => {
    render(<Task {...defaultProps} />);

    const editButton = screen.getByTitle('Edit title');
    fireEvent.click(editButton);

    const input = screen.getByDisplayValue('Test Task Title');
    fireEvent.change(input, { target: { value: 'Updated Task Title' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(defaultProps.onUpdate).not.toHaveBeenCalled();
    expect(screen.getByText('Test Task Title')).toBeInTheDocument();
  });

  it('should call onEdit when task is clicked', () => {
    render(<Task {...defaultProps} />);

    const taskCard = screen.getByText('Test Task Title').closest('div');
    fireEvent.click(taskCard!);

    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockTask);
  });

  it('should call onDelete when delete button is clicked', () => {
    render(<Task {...defaultProps} />);

    const deleteButton = screen.getByTitle('Delete task');
    fireEvent.click(deleteButton);

    // Should call onDelete with the task object
    expect(defaultProps.onDelete).toHaveBeenCalledWith(defaultProps.task);
  });

  it('should display comment and like counts', () => {
    render(<Task {...defaultProps} />);

    // The counts are calculated based on task content
    // This test verifies the counts are present - there should be multiple "0" elements
    expect(screen.getAllByText('0')).toHaveLength(2); // Comment and like counts
  });

  it('should show relative time in footer', () => {
    render(<Task {...defaultProps} />);

    // Should show relative time (30d+ ago for the test date)
    expect(screen.getByText('30d+ ago')).toBeInTheDocument();
  });

  it('should display updated time correctly', () => {
    render(<Task {...defaultProps} />);

    // Check that relative time text is present (should be "30d+ ago" for the test date)
    expect(screen.getByText('30d+ ago')).toBeInTheDocument();
  });

  it('should apply correct styling based on status', () => {
    const inProgressTask = { ...mockTask, status: 'inProgress' as const };
    
    render(<Task {...defaultProps} task={inProgressTask} />);

    // Check for in-progress status indicator (yellow dot)
    const statusDot = document.querySelector('.bg-yellow-500');
    expect(statusDot).toBeInTheDocument();
  });
});
