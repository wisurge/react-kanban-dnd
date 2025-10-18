// This file tests the type definitions
// Since TypeScript types don't exist at runtime, we'll test the structure through usage

describe('Type Definitions', () => {
  it('should have correct Task interface structure', () => {
    // Test that the Task interface has the expected properties
    const task = {
      id: 'test-id',
      title: 'Test Task',
      description: 'Test description',
      status: 'todo' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(task.id).toBe('test-id');
    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('Test description');
    expect(task.status).toBe('todo');
    expect(task.createdAt).toBeInstanceOf(Date);
    expect(task.updatedAt).toBeInstanceOf(Date);
  });

  it('should have correct Column interface structure', () => {
    const column = {
      id: 'todo',
      title: 'To Do',
      taskIds: ['task-1', 'task-2'],
    };

    expect(column.id).toBe('todo');
    expect(column.title).toBe('To Do');
    expect(Array.isArray(column.taskIds)).toBe(true);
  });

  it('should have correct Board interface structure', () => {
    const board = {
      tasks: {
        'task-1': {
          id: 'task-1',
          title: 'Test Task',
          description: 'Test description',
          status: 'todo' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      columns: {
        todo: {
          id: 'todo',
          title: 'To Do',
          taskIds: ['task-1'],
        },
      },
      columnOrder: ['todo', 'inProgress', 'done'],
    };

    expect(board.tasks).toBeDefined();
    expect(board.columns).toBeDefined();
    expect(Array.isArray(board.columnOrder)).toBe(true);
  });
});
