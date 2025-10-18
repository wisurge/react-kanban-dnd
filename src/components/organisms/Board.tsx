import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { useBoardStore } from '../../store/boardStore';
import { createCustomBackend, initializeMobileDragDrop } from '../../utils/dndBackend';
import { Column } from './Column';
import { TaskModal } from '../molecules/TaskModal';
import { HistoryLog } from '../molecules/HistoryLog';
import { DeleteConfirmationModal } from '../molecules/DeleteConfirmationModal';
import { Task as TaskType } from '../../types';

export function Board() {
  const { board, isLoading, error, addTask, updateTask, updateTaskStatus, deleteTask } = useBoardStore();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchFilter, setSearchFilter] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<TaskType | null>(null);

  // Initialize mobile drag and drop support
  useEffect(() => {
    initializeMobileDragDrop();
  }, []);

  const getTasksForColumn = (columnId: string): TaskType[] => {
    const tasks = board.columns[columnId].taskIds
      .map(taskId => board.tasks[taskId])
      .filter(Boolean);
    
    // Filter tasks by search term if provided
    if (searchFilter.trim()) {
      return tasks.filter(task => 
        task.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchFilter.toLowerCase()))
      );
    }
    
    return tasks;
  };

  const handleCreateTask = () => {
    setModalMode('create');
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: TaskType) => {
    setModalMode('edit');
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setModalMode('create');
  };

  const handleDeleteTask = (task: TaskType) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
    setIsDeleteModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <DndProvider backend={createCustomBackend()}>
      <div className="min-h-screen bg-gray-50">
        {/* Jira-style Header */}
        <div className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between space-y-3 xl:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs sm:text-sm">K</span>
                  </div>
                  <div>
                    <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">Kanban Board</h1>
                    <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Software Development</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4">
                {/* Search Filter */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search tasks..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-56 lg:w-64"
                  />
                  {searchFilter && (
                    <button
                      onClick={() => setSearchFilter('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                  <span className="hidden sm:inline">View:</span>
                  <button className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 text-xs sm:text-sm">
                    Board
                  </button>
                </div>
                
                <button 
                  onClick={handleCreateTask}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="hidden sm:inline">Create Issue</span>
                  <span className="sm:hidden">Create</span>
                </button>
                
              </div>
            </div>
          </div>
        </div>

            {/* Board Container */}
            <div className="px-4 sm:px-6 py-6">
              <div className="max-w-7xl mx-auto">
                {/* Search Results Info */}
                {searchFilter && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="text-sm text-blue-800">
                          Showing results for "{searchFilter}"
                        </span>
                      </div>
                      <button
                        onClick={() => setSearchFilter('')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Clear search
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Board */}
                <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                  {/* Main Board */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                    {board.columnOrder.map((columnId) => (
                      <Column
                        key={columnId}
                        column={board.columns[columnId]}
                        tasks={getTasksForColumn(columnId)}
                        onAddTask={(title, description) => addTask(title, description, columnId as 'todo' | 'inProgress' | 'done')}
                        onUpdateTask={updateTask}
                        onDeleteTask={handleDeleteTask}
                        onUpdateTaskStatus={updateTaskStatus}
                        onEditTask={handleEditTask}
                      />
                    ))}
                  </div>
                  
                  {/* History Sidebar */}
                  <div className="w-full xl:w-80 flex-shrink-0">
                    <HistoryLog />
                  </div>
                </div>
          </div>
        </div>
      </div>

      {/* Task Creation/Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseModal}
        onCreateTask={addTask}
        onUpdateTask={updateTask}
        editingTask={editingTask}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDelete?.title || ''}
      />
    </DndProvider>
  );
}