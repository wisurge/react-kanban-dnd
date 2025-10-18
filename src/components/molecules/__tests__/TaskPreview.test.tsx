import React from 'react';
import { render, screen } from '@testing-library/react';
import { TaskPreview } from '../TaskPreview';

const mockTask = {
  id: 'test-task-1',
  title: 'Test Task Title',
  description: 'Test description',
  status: 'todo' as const,
  createdAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2024-01-15T10:00:00Z'),
};

const defaultProps = {
  task: mockTask,
  onClose: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('TaskPreview Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render task preview with task details', () => {
    render(<TaskPreview {...defaultProps} />);

    expect(screen.getByText('Test Task Title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should render close button', () => {
    render(<TaskPreview {...defaultProps} />);

    expect(screen.getByText('Test Task Title')).toBeInTheDocument();
  });

  it('should render edit and delete buttons', () => {
    render(<TaskPreview {...defaultProps} />);

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<TaskPreview {...defaultProps} />);

    expect(screen.getByText('Test Task Title')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(<TaskPreview {...defaultProps} />);

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', () => {
    render(<TaskPreview {...defaultProps} />);

    expect(screen.getByText('Test Task Title')).toBeInTheDocument();
  });
});
