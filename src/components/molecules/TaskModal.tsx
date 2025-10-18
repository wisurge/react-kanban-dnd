import React, { useState, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Task as TaskType } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (title: string, description: string, status: 'todo' | 'inProgress' | 'done') => void;
  onUpdateTask?: (id: string, title?: string, description?: string, status?: 'todo' | 'inProgress' | 'done') => void;
  editingTask?: TaskType | null;
  mode?: 'create' | 'edit';
}

export function TaskModal({ 
  isOpen, 
  onClose, 
  onCreateTask, 
  onUpdateTask, 
  editingTask, 
  mode = 'create' 
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'todo' | 'inProgress' | 'done'>('todo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form fields when editingTask changes
  useEffect(() => {
    if (mode === 'edit' && editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setStatus(editingTask.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
    }
  }, [mode, editingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (mode === 'edit' && editingTask && onUpdateTask) {
        await onUpdateTask(editingTask.id, title.trim(), description.trim(), status);
      } else {
        await onCreateTask(title.trim(), description.trim(), status);
      }
      handleClose();
    } catch (error) {
      // Error handling - could be enhanced with user notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setStatus('todo');
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'edit' ? `Update Issue` : 'Create New Issue'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={setTitle}
              placeholder="Enter task title..."
              className="w-full"
              autoFocus={true}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'todo' | 'inProgress' | 'done')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {mode === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {mode === 'edit' ? 'Update Issue' : 'Create Issue'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
