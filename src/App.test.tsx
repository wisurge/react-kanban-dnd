import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the boardStore
jest.mock('./store/boardStore', () => ({
  useBoardStore: () => ({
    board: {
      tasks: {},
      columns: {
        todo: { id: 'todo', title: 'To Do', taskIds: [] },
        inProgress: { id: 'inProgress', title: 'In Progress', taskIds: [] },
        done: { id: 'done', title: 'Done', taskIds: [] },
      },
      columnOrder: ['todo', 'inProgress', 'done'],
    },
    isLoading: false,
    error: null,
    history: [],
    addTask: jest.fn(),
    updateTask: jest.fn(),
    updateTaskStatus: jest.fn(),
    deleteTask: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    addToHistory: jest.fn(),
  }),
}));

test('renders kanban board', () => {
  render(<App />);
  const boardElement = screen.getByText('Kanban Board');
  expect(boardElement).toBeInTheDocument();
});
