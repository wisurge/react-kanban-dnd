import { act, renderHook } from '@testing-library/react';
import { useBoardStore } from '../boardStore';
import { Task } from '../../types';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('boardStore', () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
    
    // Reset store state
    useBoardStore.setState({
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
    });
  });

  describe('addTask', () => {
    it('should add a new task to the todo column by default', () => {
      const { result } = renderHook(() => useBoardStore());
      
      act(() => {
        result.current.addTask('Test task', 'Test description');
      });

      const tasks = result.current.board.tasks;
      const taskIds = Object.keys(tasks);
      expect(taskIds).toHaveLength(1);
      
      const task = tasks[taskIds[0]];
      expect(task.title).toBe('Test task');
      expect(task.description).toBe('Test description');
      expect(task.status).toBe('todo');
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
      
      // Check that task is added to todo column
      expect(result.current.board.columns.todo.taskIds).toContain(task.id);
    });

    it('should add a task to specified status column', () => {
      const { result } = renderHook(() => useBoardStore());
      
      act(() => {
        result.current.addTask('Test task', 'Test description', 'inProgress');
      });

      const tasks = result.current.board.tasks;
      const taskIds = Object.keys(tasks);
      const task = tasks[taskIds[0]];
      
      expect(task.status).toBe('inProgress');
      expect(result.current.board.columns.inProgress.taskIds).toContain(task.id);
    });

    it('should add task to history', () => {
      const { result } = renderHook(() => useBoardStore());
      
      act(() => {
        result.current.addTask('Test task', 'Test description', 'done');
      });

      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].action).toBe('Created');
      expect(result.current.history[0].taskTitle).toBe('Test task');
      expect(result.current.history[0].details).toBe('Added to done column');
    });
  });

  describe('updateTask', () => {
    let taskId: string;

    beforeEach(() => {
      const { result } = renderHook(() => useBoardStore());
      
      act(() => {
        result.current.addTask('Original title', 'Original description', 'todo');
      });

      const tasks = result.current.board.tasks;
      taskId = Object.keys(tasks)[0];
    });

    it('should update task title and description', () => {
      const { result } = renderHook(() => useBoardStore());
      
      act(() => {
        result.current.updateTask(taskId, 'Updated title', 'Updated description');
      });

      const task = result.current.board.tasks[taskId];
      expect(task.title).toBe('Updated title');
      expect(task.description).toBe('Updated description');
      expect(task.updatedAt).not.toEqual(task.createdAt);
    });

    it('should move task between columns when status changes', () => {
      const { result } = renderHook(() => useBoardStore());
      
      act(() => {
        result.current.updateTask(taskId, undefined, undefined, 'done');
      });

      const task = result.current.board.tasks[taskId];
      expect(task.status).toBe('done');
      expect(result.current.board.columns.todo.taskIds).not.toContain(taskId);
      expect(result.current.board.columns.done.taskIds).toContain(taskId);
    });

    it('should add to history when updating', () => {
      const { result } = renderHook(() => useBoardStore());
      
      act(() => {
        result.current.updateTask(taskId, 'Updated title');
      });

      expect(result.current.history).toHaveLength(2); // 1 for create + 1 for update
      expect(result.current.history[0].action).toBe('Updated');
      expect(result.current.history[0].taskTitle).toBe('Original title');
      expect(result.current.history[0].details).toBe('Title changed to "Updated title"');
    });
  });

  describe('updateTaskStatus', () => {
    let taskId: string;

    beforeEach(() => {
      const { result } = renderHook(() => useBoardStore());
      
      act(() => {
        result.current.addTask('Test task', 'Test description', 'todo');
      });

      const tasks = result.current.board.tasks;
      taskId = Object.keys(tasks)[0];
    });

    it('should update task status and move between columns', () => {
      const { result } = renderHook(() => useBoardStore());
      
      act(() => {
        result.current.updateTaskStatus(taskId, 'inProgress');
      });

      const task = result.current.board.tasks[taskId];
      expect(task.status).toBe('inProgress');
      expect(result.current.board.columns.todo.taskIds).not.toContain(taskId);
      expect(result.current.board.columns.inProgress.taskIds).toContain(taskId);
    });

    it('should not update if status is the same', () => {
      const { result } = renderHook(() => useBoardStore());
      const initialHistoryLength = result.current.history.length;
      
      act(() => {
        result.current.updateTaskStatus(taskId, 'todo');
      });

      expect(result.current.history).toHaveLength(initialHistoryLength);
    });

    it('should add to history when status changes', () => {
      const { result } = renderHook(() => useBoardStore());
      
      act(() => {
        result.current.updateTaskStatus(taskId, 'done');
      });

      expect(result.current.history).toHaveLength(2);
      expect(result.current.history[0].action).toBe('Moved');
      expect(result.current.history[0].details).toBe('From todo to done');
    });
  });

  describe('deleteTask', () => {
    let taskId: string;

    beforeEach(() => {
      const { result } = renderHook(() => useBoardStore());
      
      act(() => {
        result.current.addTask('Test task', 'Test description', 'todo');
      });

      const tasks = result.current.board.tasks;
      taskId = Object.keys(tasks)[0];
    });

    it('should remove task from board and column', () => {
      const { result } = renderHook(() => useBoardStore());
      
      act(() => {
        result.current.deleteTask(taskId);
      });

      expect(result.current.board.tasks[taskId]).toBeUndefined();
      expect(result.current.board.columns.todo.taskIds).not.toContain(taskId);
    });

    it('should add to history when deleting', () => {
      const { result } = renderHook(() => useBoardStore());
      
      act(() => {
        result.current.deleteTask(taskId);
      });

      expect(result.current.history).toHaveLength(2);
      expect(result.current.history[0].action).toBe('Deleted');
      expect(result.current.history[0].taskTitle).toBe('Test task');
    });
  });

  describe('history management', () => {
    it('should limit history to 5 entries', () => {
      const { result } = renderHook(() => useBoardStore());
      
      // Add 6 tasks to exceed history limit
      for (let i = 0; i < 6; i++) {
        act(() => {
          result.current.addTask(`Task ${i}`, 'Description');
        });
      }

      expect(result.current.history).toHaveLength(5);
    });

    it('should add history entry with correct structure', () => {
      const { result } = renderHook(() => useBoardStore());
      
      act(() => {
        result.current.addTask('Test task', 'Test description');
      });

      const historyEntry = result.current.history[0];
      expect(historyEntry).toHaveProperty('id');
      expect(historyEntry).toHaveProperty('action');
      expect(historyEntry).toHaveProperty('taskTitle');
      expect(historyEntry).toHaveProperty('timestamp');
      expect(historyEntry).toHaveProperty('details');
      expect(historyEntry.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('setLoading and setError', () => {
    it('should update loading state', () => {
      const { result } = renderHook(() => useBoardStore());
      
      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should update error state', () => {
      const { result } = renderHook(() => useBoardStore());
      
      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBe(null);
    });
  });

  it('should handle updateTaskStatus with same status (no change)', () => {
    const { result } = renderHook(() => useBoardStore());

    // First add a task
    act(() => {
      result.current.addTask('Test Task', 'Test description', 'todo');
    });

    const taskId = Object.keys(result.current.board.tasks)[0];

    // Try to update to the same status
    act(() => {
      result.current.updateTaskStatus(taskId, 'todo');
    });

    // Should still be in todo column
    expect(result.current.board.columns.todo.taskIds).toContain(taskId);
  });

  it('should handle deleteTask with non-existent task', () => {
    const { result } = renderHook(() => useBoardStore());

    // Try to delete a non-existent task
    act(() => {
      result.current.deleteTask('non-existent-id');
    });

    // Should not throw error and board should remain unchanged
    expect(result.current.board.tasks).toEqual({});
  });

  it('should handle updateTask with non-existent task', () => {
    const { result } = renderHook(() => useBoardStore());

    // Try to update a non-existent task
    act(() => {
      result.current.updateTask('non-existent-id', 'New Title', 'New description', 'todo');
    });

    // Should not throw error and board should remain unchanged
    expect(result.current.board.tasks).toEqual({});
  });
});
