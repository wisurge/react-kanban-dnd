import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useBoardStore } from '../../store/boardStore';
import { Task as TaskType } from '../../types';
import { getRelativeTime } from '../../utils/dateUtils';

interface TaskProps {
  task: TaskType;
  onUpdate: (id: string, title?: string, description?: string) => void;
  onDelete: (task: TaskType) => void;
  onUpdateTaskStatus: (id: string, status: 'todo' | 'inProgress' | 'done') => void;
  onEdit?: (task: TaskType) => void;
}

export function Task({ task, onUpdate, onDelete, onUpdateTaskStatus, onEdit }: TaskProps) {
  const { updateTaskStatus } = useBoardStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string }, monitor: any) => {
      const draggedTaskId = item.id;
      const targetTaskId = task.id;
      
      
      // Get tasks from Zustand store (always fresh)
      const board = useBoardStore.getState().board;
      const targetTask = board.tasks[targetTaskId];
      if (!targetTask) {
        return;
      }
      
      const draggedTask = board.tasks[draggedTaskId];
      if (!draggedTask) {
        return;
      }
      
      // If dropping on self, do nothing
      if (draggedTaskId === targetTaskId) {
        return;
      }
      
      // Update the dragged task's status to match the target task's status
      if (draggedTask.status !== targetTask.status) {
        
        // Use Zustand action directly
        updateTaskStatus(draggedTaskId, targetTask.status);
      } else {
      }
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const ref = (node: HTMLDivElement | null) => {
    drag(node);
    drop(node);
  };

  // Generate a Jira-style issue key
  const issueKey = `KAN-${task.id.split('-')[1]}`;
  
  // Determine priority based on task title length (more descriptive = higher priority)
  const getPriority = (title: string) => {
    if (title.length > 50) return 'Highest';
    if (title.length > 30) return 'High';
    if (title.length > 15) return 'Medium';
    if (title.length > 8) return 'Low';
    return 'Lowest';
  };
  const priority = getPriority(task.title);
  
  // Determine issue type based on task content
  const getIssueType = (title: string, description?: string) => {
    const content = `${title} ${description || ''}`.toLowerCase();
    if (content.includes('bug') || content.includes('fix') || content.includes('error')) return 'Bug';
    if (content.includes('story') || content.includes('feature') || content.includes('user')) return 'Story';
    if (content.includes('epic') || content.includes('major') || content.includes('project')) return 'Epic';
    return 'Task';
  };
  const issueType = getIssueType(task.title, task.description);

  // Generate deterministic numbers based on task content
  const getCommentCount = (title: string, description?: string) => {
    const content = `${title} ${description || ''}`.toLowerCase();
    const matches = content.match(/comment|discuss|review|feedback/g) || [];
    return Math.min(matches.length, 4);
  };
  
  const getLikeCount = (title: string, description?: string) => {
    const content = `${title} ${description || ''}`.toLowerCase();
    const matches = content.match(/like|love|great|awesome|good/g) || [];
    return Math.min(matches.length, 2);
  };

  // For personal Kanban board, no need for multiple assignees
  
  const commentCount = getCommentCount(task.title, task.description);
  const likeCount = getLikeCount(task.title, task.description);

  // Get relative time for display
  const relativeTime = getRelativeTime(task.createdAt);

  // Inline editing handlers
  const handleTitleDoubleClick = () => {
    setIsEditingTitle(true);
    setEditTitle(task.title);
  };

  const handleTitleSubmit = () => {
    if (editTitle.trim() && editTitle.trim() !== task.title) {
      onUpdate(task.id, editTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditTitle(task.title);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  // Detect if device supports touch
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  return (
    <div
      ref={ref}
      className={`bg-white border border-gray-200 rounded-lg p-2 sm:p-3 ${isEditingTitle ? 'cursor-default' : isTouchDevice() ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'} min-h-[100px] sm:min-h-[120px] flex flex-col group ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      } ${
        isOver ? 'ring-2 ring-blue-400 bg-blue-50' : ''
      } ${
        isEditingTitle ? 'ring-2 ring-green-400 bg-green-50' : ''
      } hover:shadow-lg hover:border-gray-300 transition-all duration-200 ${
        isTouchDevice() ? 'touch-manipulation' : ''
      }`}
      data-dnd-draggable="task"
      data-dnd-id={task.id}
      title={task.description ? `Description: ${task.description}` : undefined}
    >
      <div 
        className="flex-1 flex flex-col space-y-1 overflow-hidden"
        onClick={() => !isEditingTitle && onEdit?.(task)}
      >
        {/* Compact Header Row */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-1">
            {/* Mobile drag indicator */}
            {isTouchDevice() && (
              <div className="flex flex-col space-y-0.5 mr-1">
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              </div>
            )}
            <span className="text-xs font-medium text-gray-500">{issueKey}</span>
            <div className={`px-1 sm:px-1.5 py-0.5 rounded text-xs font-medium ${
              issueType === 'Bug' ? 'bg-red-100 text-red-700' :
              issueType === 'Story' ? 'bg-blue-100 text-blue-700' :
              issueType === 'Task' ? 'bg-green-100 text-green-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {issueType}
            </div>
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
              priority === 'Highest' ? 'bg-red-500' :
              priority === 'High' ? 'bg-orange-500' :
              priority === 'Medium' ? 'bg-yellow-500' :
              priority === 'Low' ? 'bg-blue-500' :
              'bg-gray-400'
            }`} title={`Priority: ${priority}`}></div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            className="text-gray-400 hover:text-red-500 transition-colors p-0.5 sm:p-1 rounded hover:bg-red-50"
            title="Delete task"
          >
            <svg className="w-3 h-3 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Title Section */}
        {isEditingTitle ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={handleTitleKeyDown}
            className="text-sm font-medium text-gray-900 leading-tight bg-transparent border border-blue-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 flex-shrink-0"
            autoFocus
          />
        ) : (
          <div className="flex items-start justify-between group/title">
            <h3 className="text-xs sm:text-sm font-medium text-gray-900 leading-tight line-clamp-2 flex-1">
              {task.title}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTitleDoubleClick();
              }}
              className="ml-1 text-gray-400 hover:text-blue-500 transition-colors p-0.5 rounded hover:bg-blue-50 opacity-0 group-hover/title:opacity-100"
              title="Edit title"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        )}

        {/* Status and Meta Info Row */}
        <div className="flex items-center justify-between text-xs text-gray-500 flex-shrink-0">
          <div className="flex items-center space-x-1">
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
              task.status === 'todo' ? 'bg-gray-400' :
              task.status === 'inProgress' ? 'bg-yellow-500' :
              'bg-green-500'
            }`}></div>
            <span className="capitalize text-xs">{task.status.replace(/([A-Z])/g, ' $1').trim()}</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-gray-400">
            <span className="hidden sm:inline">{commentCount}</span>
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="hidden sm:inline">{likeCount}</span>
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>

        {/* Footer Section with relative time */}
        <div className="flex items-center justify-end pt-1 border-t border-gray-100 flex-shrink-0">
          <span className="text-xs text-gray-400">{relativeTime}</span>
        </div>
      </div>

    </div>
  );
}