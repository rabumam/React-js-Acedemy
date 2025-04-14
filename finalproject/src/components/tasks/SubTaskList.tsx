'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, CheckSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { SubTaskItem } from './SubTaskItem';
import type { SubTask, PriorityLevel } from '@/types';

interface SubTaskListProps {
  taskId: string;
  subTasks: SubTask[];
  onAddSubTask: (taskId: string, title: string) => void;
  onUpdateSubTask: (taskId: string, subTaskId: string, updatedData: Partial<SubTask>) => void;
  onDeleteSubTask: (taskId: string, subTaskId: string) => void;
}

export const SubTaskList = ({
  taskId,
  subTasks,
  onAddSubTask,
  onUpdateSubTask,
  onDeleteSubTask
}: SubTaskListProps) => {
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

  const handleAddSubTask = () => {
    if (newSubTaskTitle.trim()) {
      onAddSubTask(taskId, newSubTaskTitle.trim());
      setNewSubTaskTitle('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddSubTask();
  };

  const completedCount = subTasks.filter(st => st.completed).length;
  const totalCount = subTasks.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium">Subtasks</h3>
        <span className="text-xs text-muted-foreground">
          {completedCount}/{totalCount} completed
        </span>
      </div>
      
      {totalCount > 0 && (
        <Progress value={progressPercentage} className="h-1.5 mb-3" />
      )}
      
      <div className="flex items-center gap-2 mb-3">
        <Input
          value={newSubTaskTitle}
          onChange={(e) => setNewSubTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a subtask..."
          className="h-8 flex-1"
          aria-label="New subtask title"
        />
        <Button 
          onClick={handleAddSubTask}
          size="sm"
          className="h-8"
          disabled={!newSubTaskTitle.trim()}
          aria-label="Add subtask"
        >
          <Plus size={16} />
        </Button>
      </div>
      
      {subTasks.length > 0 ? (
        <ScrollArea className="max-h-60">
          <div className="space-y-1">
            {subTasks.map((subTask) => (
              <SubTaskItem
                key={subTask.id}
                subTask={subTask}
                taskId={taskId}
                onUpdate={onUpdateSubTask}
                onDelete={onDeleteSubTask}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="py-4 flex flex-col items-center justify-center text-muted-foreground text-sm">
          <CheckSquare size={24} className="mb-2 opacity-50" />
          <p>No subtasks yet</p>
          <p className="text-xs">Break down your task into smaller steps</p>
        </div>
      )}
    </div>
  );
};