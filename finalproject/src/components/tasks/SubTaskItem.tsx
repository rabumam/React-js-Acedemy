'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SubTask } from '@/types';

interface SubTaskItemProps {
  subTask: SubTask;
  taskId: string;
  onUpdate: (taskId: string, subTaskId: string, updatedData: Partial<SubTask>) => void;
  onDelete: (taskId: string, subTaskId: string) => void;
}

export const SubTaskItem = ({
  subTask,
  taskId,
  onUpdate,
  onDelete
}: SubTaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(subTask.title);

  const handleToggleComplete = () => {
    onUpdate(taskId, subTask.id, { completed: !subTask.completed });
  };

  const handleStartEdit = () => {
    setEditedTitle(subTask.title);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      onUpdate(taskId, subTask.id, { title: editedTitle });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(subTask.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="flex items-center group p-2 rounded-md hover:bg-accent/50 transition-colors">
      <Checkbox 
        checked={subTask.completed}
        onCheckedChange={handleToggleComplete}
        className="mr-2 flex-shrink-0"
        aria-label={subTask.completed ? 'Mark incomplete' : 'Mark complete'}
      />
      
      {isEditing ? (
        <div className="flex items-center w-full gap-2">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-8"
            autoFocus
            aria-label="Edit subtask title"
          />
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSaveEdit}
              className="h-8 w-8"
              aria-label="Save changes"
            >
              <Check size={16} className="text-green-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCancelEdit}
              className="h-8 w-8"
              aria-label="Cancel editing"
            >
              <X size={16} className="text-red-500" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <span 
            className={cn(
              "text-sm truncate",
              subTask.completed && "line-through text-muted-foreground"
            )}
            aria-label={subTask.completed ? 'Completed subtask' : 'Incomplete subtask'}
          >
            {subTask.title}
          </span>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleStartEdit}
              className="h-8 w-8"
              aria-label="Edit subtask"
            >
              <Edit size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(taskId, subTask.id)}
              className="h-8 w-8 text-destructive hover:text-destructive/80"
              aria-label="Delete subtask"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};