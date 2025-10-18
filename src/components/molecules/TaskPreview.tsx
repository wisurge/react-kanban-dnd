import React from 'react';
import { Task as TaskType } from '../../types';
import { Card } from '../atoms/Card';

interface TaskPreviewProps {
  task: TaskType;
}

export function TaskPreview({ task }: TaskPreviewProps) {
  return (
    <Card className="opacity-90">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
        {task.description ? (
          <div className="text-xs text-gray-600 line-clamp-3">{task.description}</div>
        ) : null}
      </div>
    </Card>
  );
}




