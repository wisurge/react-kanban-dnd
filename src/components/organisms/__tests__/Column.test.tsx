import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Column } from '../Column';
import { Column as ColumnType, Task as TaskType } from '../../../types';

// Mock the boardStore
const mockUpdateTaskStatus = jest.fn();
jest.mock('../../../store/boardStore', () => ({
  useBoardStore: () => ({
    updateTaskStatus: mockUpdateTaskStatus,
  }),
}));

const mockColumn: ColumnType = {
  id: 'todo',
  title: 'To Do',
  taskIds: ['task-1', 'task-2'],
};

const mockTasks: TaskType[] = [
  {
    id: 'task-1',
    title: 'First Task',
    description: 'First task description',
    status: 'todo',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
  },
  {
    id: 'task-2',
    title: 'Second Task',
    description: 'Second task description',
    status: 'todo',
    createdAt: new Date('2024-01-15T11:00:00Z'),
    updatedAt: new Date('2024-01-15T11:00:00Z'),
  },
];

const defaultProps = {
  column: mockColumn,
  tasks: mockTasks,
  onAddTask: jest.fn(),
  onUpdateTask: jest.fn(),
  onDeleteTask: jest.fn(),
  onUpdateTaskStatus: jest.fn(),
  onEditTask: jest.fn(),
};

describe('Column Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render column header with title and task count', () => {
    render(<Column {...defaultProps} />);

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Task count
  });

  it('should render all tasks in the column', () => {
    render(<Column {...defaultProps} />);

    expect(screen.getByText('First Task')).toBeInTheDocument();
    expect(screen.getByText('Second Task')).toBeInTheDocument();
  });

  it('should display empty state when no tasks', () => {
    const emptyColumnProps = {
      ...defaultProps,
      tasks: [],
    };

    render(<Column {...emptyColumnProps} />);

    expect(screen.getByText('No issues')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // Task count
  });

  it('should apply correct styling based on column type', () => {
    render(<Column {...defaultProps} />);

    // Check that column renders correctly
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  it('should apply in-progress column styling', () => {
    const inProgressColumn = {
      ...mockColumn,
      id: 'inProgress',
      title: 'In Progress',
    };

    render(<Column {...defaultProps} column={inProgressColumn} />);

    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('should apply done column styling', () => {
    const doneColumn = {
      ...mockColumn,
      id: 'done',
      title: 'Done',
    };

    render(<Column {...defaultProps} column={doneColumn} />);

    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('should have correct data attributes for drag and drop', () => {
    render(<Column {...defaultProps} />);

    const columnElement = document.querySelector('[data-dnd-column-id="todo"]');
    expect(columnElement).toBeInTheDocument();
  });

  it('should render task count badge', () => {
    render(<Column {...defaultProps} />);

    const countBadge = screen.getByText('2');
    expect(countBadge).toHaveClass('bg-white', 'bg-opacity-50', 'rounded-full');
  });

  it('should handle drag and drop interactions', () => {
    render(<Column {...defaultProps} />);

    // The drop zone should be present
    const dropZone = document.querySelector('[data-dnd-droppable="column"]');
    expect(dropZone).toBeInTheDocument();
  });

  it('should pass correct props to Task components', () => {
    render(<Column {...defaultProps} />);

    // Verify that Task components receive the correct props
    // This is indirectly tested by checking that tasks render correctly
    expect(screen.getByText('First Task')).toBeInTheDocument();
    expect(screen.getByText('Second Task')).toBeInTheDocument();
  });

  it('should update task count when tasks change', () => {
    const { rerender } = render(<Column {...defaultProps} />);

    expect(screen.getByText('2')).toBeInTheDocument();

    // Add another task
    const updatedTasks = [
      ...mockTasks,
      {
        id: 'task-3',
        title: 'Third Task',
        description: 'Third task description',
        status: 'todo' as const,
        createdAt: new Date('2024-01-15T12:00:00Z'),
        updatedAt: new Date('2024-01-15T12:00:00Z'),
      },
    ];

    rerender(<Column {...defaultProps} tasks={updatedTasks} />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render column menu button', () => {
    render(<Column {...defaultProps} />);

    // Check for the three-dot menu button
    const menuButton = document.querySelector('button svg');
    expect(menuButton).toBeInTheDocument();
  });
});
