
import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { Card } from '../components/ui/card';
import { GripVertical } from 'lucide-react';

const Tasks = () => {
  return (
    <AppLayout>
      <TaskForm />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">My Tasks</h1>
        <p className="text-muted-foreground">View and manage all your tasks in one place</p>
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <GripVertical size={14} className="mr-1" />
          <span>Drag and drop tasks to reorder them</span>
        </div>
      </div>
      
      <Card className="p-4">
        <TaskList />
      </Card>
    </AppLayout>
  );
};

export default Tasks;
