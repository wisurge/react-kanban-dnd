import React from 'react';
import { useBoardStore } from '../../store/boardStore';
import { getRelativeTime } from '../../utils/dateUtils';

export function HistoryLog() {
  const { history } = useBoardStore();

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Activity</h3>
        <p className="text-sm text-gray-500">No recent activity</p>
      </div>
    );
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Created':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'Updated':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'Moved':
        return (
          <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        );
      case 'Deleted':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatTime = (timestamp: Date | string) => {
    const timestampDate = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return getRelativeTime(timestampDate);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h3>
      <div className="space-y-3">
        {history.map((entry) => (
          <div key={entry.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getActionIcon(entry.action)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-900 truncate">
                  <span className="font-medium">{entry.action}</span> "{entry.taskTitle}"
                </p>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {formatTime(entry.timestamp)}
                </span>
              </div>
              {entry.details && (
                <p className="text-xs text-gray-500 mt-1">{entry.details}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

