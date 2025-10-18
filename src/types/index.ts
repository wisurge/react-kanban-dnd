export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inProgress' | 'done';
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Board {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
}

export type ColumnType = 'todo' | 'inProgress' | 'done';

export interface BoardState {
  board: Board;
  isLoading: boolean;
  error: string | null;
}

export type BoardAction =
  | { type: 'ADD_TASK'; payload: { title: string; description?: string; status: 'todo' | 'inProgress' | 'done' } }
  | { type: 'UPDATE_TASK'; payload: { id: string; title?: string; description?: string } }
  | { type: 'UPDATE_TASK_STATUS'; payload: { id: string; status: 'todo' | 'inProgress' | 'done' } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'MOVE_TASK'; payload: { taskId: string; sourceColumnId: string; destinationColumnId: string; sourceIndex: number; destinationIndex: number } }
  | { type: 'SET_BOARD'; payload: Board }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };


