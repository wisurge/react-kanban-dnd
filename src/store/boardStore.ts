import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Board, Task, ColumnType } from '../types';

interface BoardState {
  board: Board;
  isLoading: boolean;
  error: string | null;
  history: Array<{
    id: string;
    action: string;
    taskTitle: string;
    timestamp: Date;
    details?: string;
  }>;
}

interface BoardActions {
  addTask: (title: string, description?: string, status?: 'todo' | 'inProgress' | 'done') => void;
  updateTask: (id: string, title?: string, description?: string, status?: 'todo' | 'inProgress' | 'done') => void;
  updateTaskStatus: (id: string, status: 'todo' | 'inProgress' | 'done') => void;
  deleteTask: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addToHistory: (action: string, taskTitle: string, details?: string) => void;
}

type BoardStore = BoardState & BoardActions;

// Initial board state
const initialBoard: Board = {
  tasks: {},
  columns: {
    todo: {
      id: 'todo',
      title: 'To Do',
      taskIds: [],
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      taskIds: [],
    },
    done: {
      id: 'done',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['todo', 'inProgress', 'done'],
};

export const useBoardStore = create<BoardStore>()(
  persist(
        (set, get) => ({
          // Initial state
          board: initialBoard,
          isLoading: false,
          error: null,
          history: [],

      // Actions
      addTask: (title: string, description?: string, status: 'todo' | 'inProgress' | 'done' = 'todo') => {
        const newTask: Task = {
          id: `task-${Date.now()}`,
          title,
          description,
          status,
          createdAt: new Date(),
          updatedAt: new Date(),
        };


        set((state) => ({
          board: {
            ...state.board,
            tasks: {
              ...state.board.tasks,
              [newTask.id]: newTask,
            },
            columns: {
              ...state.board.columns,
              [status]: {
                ...state.board.columns[status],
                taskIds: [...state.board.columns[status].taskIds, newTask.id],
              },
            },
          },
        }));
        
        // Add to history
        get().addToHistory('Created', title, `Added to ${status} column`);
      },

      updateTask: (id: string, title?: string, description?: string, status?: ColumnType) => {
        const existingTask = get().board.tasks[id];
        if (!existingTask) return;

        const updatedTask = {
          ...existingTask,
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(status !== undefined && { status }),
          updatedAt: new Date(),
        };


        // If status changed, move task between columns
        if (status !== undefined && status !== existingTask.status) {
          set((state) => {
            const newColumns = { ...state.board.columns };
            
            // Remove from old column
            newColumns[existingTask.status] = {
              ...newColumns[existingTask.status],
              taskIds: newColumns[existingTask.status].taskIds.filter(taskId => taskId !== id),
            };
            
            // Add to new column
            newColumns[status] = {
              ...newColumns[status],
              taskIds: [...newColumns[status].taskIds, id],
            };

            return {
              board: {
                ...state.board,
                tasks: {
                  ...state.board.tasks,
                  [id]: updatedTask,
                },
                columns: newColumns,
              },
            };
          });
        } else {
          // Just update task without moving columns
          set((state) => ({
            board: {
              ...state.board,
              tasks: {
                ...state.board.tasks,
                [id]: updatedTask,
              },
            },
          }));
        }
        
        // Add to history
        if (title !== undefined && title !== existingTask.title) {
          get().addToHistory('Updated', existingTask.title, `Title changed to "${title}"`);
        }
        if (status !== undefined && status !== existingTask.status) {
          get().addToHistory('Moved', existingTask.title, `From ${existingTask.status} to ${status}`);
        }
      },

      updateTaskStatus: (id: string, status: 'todo' | 'inProgress' | 'done') => {
        const existingTask = get().board.tasks[id];
        if (!existingTask) return;


        // Find current column and remove task from it
        let currentColumnId = '';
        Object.keys(get().board.columns).forEach(columnId => {
          if (get().board.columns[columnId].taskIds.includes(id)) {
            currentColumnId = columnId;
          }
        });


        if (currentColumnId === status) {
          return; // No change needed
        }

        const updatedTask = {
          ...existingTask,
          status,
          updatedAt: new Date(),
        };

        // Remove from current column and add to new column
        set((state) => {
          const newColumns = { ...state.board.columns };
          newColumns[currentColumnId] = {
            ...newColumns[currentColumnId],
            taskIds: newColumns[currentColumnId].taskIds.filter(taskId => taskId !== id),
          };
          newColumns[status] = {
            ...newColumns[status],
            taskIds: [...newColumns[status].taskIds, id],
          };


          return {
            board: {
              ...state.board,
              tasks: {
                ...state.board.tasks,
                [id]: updatedTask,
              },
              columns: newColumns,
            },
          };
        });
        
        // Add to history
        get().addToHistory('Moved', existingTask.title, `From ${existingTask.status} to ${status}`);
      },

      deleteTask: (id: string) => {
        const existingTask = get().board.tasks[id];
        if (!existingTask) return;
        

        set((state) => {
          const newTasks = { ...state.board.tasks };
          delete newTasks[id];

          const newColumns = { ...state.board.columns };
          Object.keys(newColumns).forEach(columnId => {
            newColumns[columnId] = {
              ...newColumns[columnId],
              taskIds: newColumns[columnId].taskIds.filter(taskId => taskId !== id),
            };
          });

          return {
            board: {
              ...state.board,
              tasks: newTasks,
              columns: newColumns,
            },
          };
        });
        
        // Add to history
        get().addToHistory('Deleted', existingTask.title);
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

          setError: (error: string | null) => {
            set({ error });
          },

          addToHistory: (action: string, taskTitle: string, details?: string) => {
            const historyEntry = {
              id: `history-${Date.now()}`,
              action,
              taskTitle,
              timestamp: new Date(),
              details,
            };

            set((state) => ({
              history: [historyEntry, ...state.history].slice(0, 5), // Keep only last 5 actions
            }));
          },
    }),
    {
      name: 'kanban-board-storage',
      // Custom storage to handle Date objects
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const parsed = JSON.parse(str);
            // Convert date strings back to Date objects
            if (parsed.state?.board?.tasks) {
              Object.keys(parsed.state.board.tasks).forEach(taskId => {
                const task = parsed.state.board.tasks[taskId];
                if (task.createdAt) task.createdAt = new Date(task.createdAt);
                if (task.updatedAt) task.updatedAt = new Date(task.updatedAt);
              });
            }
            return parsed;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          // Convert Date objects to strings for storage
          const serialized = JSON.parse(JSON.stringify(value, (key, val) => {
            if (val instanceof Date) {
              return val.toISOString();
            }
            return val;
          }));
          localStorage.setItem(name, JSON.stringify(serialized));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
