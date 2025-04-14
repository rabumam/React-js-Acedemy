'use client';

import { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  GripVertical,
  Edit,
  Trash2,
  CheckCircle2,
  AlarmClock,
  Flag,
  CalendarDays
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriorityBadge } from '@/components/PriorityBadge';
import { type DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { formatDistance } from 'date-fns';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description?: string;
    priority: PriorityLevel;
    status: 'active' | 'completed';
    dueDate?: Date;
    categoryId?: string;
    subTasks: Array<{ id: string; title: string; completed: boolean }>;
  };
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export const TaskItem = ({ task, dragHandleProps }: TaskItemProps) => {
  const { toggleTaskSelection, selectedTaskIds, updateTask, deleteTask } = useTask();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const isSelected = selectedTaskIds.includes(task.id);
  const completedSubtasks = task.subTasks.filter(st => st.completed).length;

  const handleToggleComplete = () => {
    updateTask(task.id, { status: task.status === 'active' ? 'completed' : 'active' });
  };

  const handleTitleEdit = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      updateTask(task.id, { title: editedTitle.trim() });
    }
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-3 rounded-lg border bg-card text-card-foreground",
        isSelected && "ring-2 ring-primary/50",
        task.status === 'completed' && "opacity-70 bg-muted/30"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Drag handle */}
        <div 
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </div>

        {/* Selection checkbox */}
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => toggleTaskSelection(task.id)}
          className="h-4 w-4 rounded-sm border-2"
          aria-label={isSelected ? 'Deselect task' : 'Select task'}
        />

        {/* Task content */}
        <div className="flex-1 min-w-0 space-y-1">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleTitleEdit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleEdit()}
                className="flex-1 bg-transparent focus:outline-none"
                autoFocus
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleComplete}
                className="text-left flex-1 min-w-0"
              >
                <span
                  className={cn(
                    "break-words",
                    task.status === 'completed' && "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </span>
              </button>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {/* Priority */}
            <PriorityBadge priority={task.priority} />

            {/* Due date */}
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <CalendarDays size={12} />
                <span>
                  {formatDistance(task.dueDate, new Date(), { addSuffix: true })}
                </span>
              </div>
            )}

            {/* Subtask progress */}
            {task.subTasks.length > 0 && (
              <div className="flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>
                  {completedSubtasks}/{task.subTasks.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className={cn(
        "flex items-center gap-1 opacity-0 transition-opacity",
        (isHovered || isSelected) && "opacity-100"
      )}>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsEditing(true)}
          aria-label="Edit task"
        >
          <Edit size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive/80"
          onClick={() => deleteTask(task.id)}
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

// PriorityBadge.tsx (companion component)
const PriorityBadge = ({ priority }: { priority: PriorityLevel }) => {
  const priorityStyles = {
    high: 'text-destructive bg-destructive/10',
    medium: 'text-warning bg-warning/10',
    low: 'text-success bg-success/10'
  };

  const priorityLabels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low'
  };

  return (
    <div className={cn(
      "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
      priorityStyles[priority]
    )}>
      <Flag size={12} />
      <span>{priorityLabels[priority]}</span>
    </div>
  );
};