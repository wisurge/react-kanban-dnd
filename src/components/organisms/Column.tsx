import React from 'react';
import { useDrop } from 'react-dnd';
import { useBoardStore } from '../../store/boardStore';
import { Column as ColumnType, Task as TaskType } from '../../types';
import { Task } from '../molecules/Task';

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
  onAddTask: (title: string, description?: string) => void;
  onUpdateTask: (id: string, title?: string, description?: string) => void;
  onDeleteTask: (task: TaskType) => void;
  onUpdateTaskStatus: (id: string, status: 'todo' | 'inProgress' | 'done') => void;
  onEditTask?: (task: TaskType) => void;
}

export function Column({ 
  column, 
  tasks, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask,
  onUpdateTaskStatus,
  onEditTask
}: ColumnProps) {
  const { updateTaskStatus } = useBoardStore();
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string }, monitor: any) => {
      const taskId = item.id;
      const newStatus = column.id as 'todo' | 'inProgress' | 'done';
      
      
      // Get the current task from Zustand store (always fresh)
      const currentTask = useBoardStore.getState().board.tasks[taskId];
      if (!currentTask) {
        return;
      }
      
      // Only update if status is different
      if (currentTask.status !== newStatus) {
        
        // Use Zustand action directly
        updateTaskStatus(taskId, newStatus);
      } else {
      }
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Jira column colors
  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'todo': return 'border-gray-300 bg-gray-50';
      case 'inProgress': return 'border-blue-300 bg-blue-50';
      case 'done': return 'border-green-300 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getColumnHeaderColor = (columnId: string) => {
    switch (columnId) {
      case 'todo': return 'text-gray-700 bg-gray-100';
      case 'inProgress': return 'text-blue-700 bg-blue-100';
      case 'done': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="flex flex-col h-full w-full" data-dnd-column-id={column.id}>
      {/* Column Header */}
      <div className={`flex items-center justify-between p-2 sm:p-3 rounded-t-lg border-t-4 ${getColumnHeaderColor(column.id)}`}>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <h2 className="font-semibold text-xs sm:text-sm uppercase tracking-wide">
            {column.title}
          </h2>
          <span className="text-xs bg-white bg-opacity-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
        <button className="p-1 text-gray-500 hover:bg-white hover:bg-opacity-50 rounded">
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Tasks Container */}
      <div
        ref={drop as any}
        className={`h-[calc(100vh-200px)] p-2 sm:p-3 space-y-2 sm:space-y-3 overflow-y-auto border-l border-r border-b rounded-b-lg transition-all duration-200 kanban-scrollbar ${
          isOver 
            ? 'bg-blue-50 border-blue-300 border-2 border-dashed' 
            : `bg-white ${getColumnColor(column.id)}`
        }`}
        data-dnd-droppable="column"
        data-dnd-id={column.id}
        data-dnd-type="column"
      >
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
            onUpdateTaskStatus={onUpdateTaskStatus}
            onEdit={onEditTask}
          />
        ))}
        
        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">No issues</p>
            <p className="text-xs text-gray-300 mt-1">Drop tasks here to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}