'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTask } from '@/contexts/TaskContext';
import { TaskItem } from './TaskItem';
import { 
  CheckSquare,
  Plus,
  Trash2,
  Filter,
  Calendar,
  ArrowDownAZ,
  Loader2,
  GripVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { 
  FilterOption, 
  SortOption, 
  DateFilterOption, 
  PriorityLevel 
} from '@/types';

const dateFilters = [
  { value: 'all', label: 'Any Time' },
  { value: 'today', label: 'Today' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'overdue', label: 'Overdue' }
] satisfies { value: DateFilterOption; label: string }[];

const priorityFilters = [
  { value: null, label: 'Any Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
] satisfies { value: PriorityLevel | null; label: string }[];

const sortOptions = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'alphabetical', label: 'Alphabetical' }
] satisfies { value: SortOption; label: string }[];

export const TaskList = () => {
  const {
    filteredTasks,
    selectedTaskIds,
    filter,
    setFilter,
    dateFilter,
    setDateFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    sortOption,
    setSortOption,
    categories,
    selectTask,
    deleteSelectedTasks,
    markSelectedTasksAsCompleted,
    clearSelectedTasks,
    reorderTasks
  } = useTask();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddTask = () => selectTask({
    id: '',
    title: '',
    status: 'active',
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date(),
    subTasks: []
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderTasks(result.source.index, result.destination.index);
  };

  if (!isLoading && filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="bg-primary/10 p-4 rounded-full">
          <CheckSquare size={32} className="text-primary" />
        </div>
        <h3 className="mt-4 text-xl font-medium">No tasks found</h3>
        <p className="mt-2 text-muted-foreground text-center max-w-md">
          {filter === 'all' && !categoryFilter && !priorityFilter && dateFilter === 'all'
            ? "You don't have any tasks yet. Create your first task to get started."
            : "No tasks match your current filters. Try adjusting your filter settings."}
        </p>
        <Button onClick={handleAddTask} className="mt-6">
          <Plus size={16} className="mr-2" />
          Add New Task
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter size={14} className="mr-2" />
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['all', 'active', 'completed'].map((f) => (
                <DropdownMenuItem
                  key={f}
                  onSelect={() => setFilter(f as FilterOption)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Calendar size={14} className="mr-2" />
                Date
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by date</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {dateFilters.map((f) => (
                <DropdownMenuItem
                  key={f.value}
                  onSelect={() => setDateFilter(f.value)}
                >
                  {f.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <ArrowDownAZ size={14} className="mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((s) => (
                <DropdownMenuItem
                  key={s.value}
                  onSelect={() => setSortOption(s.value)}
                >
                  {s.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Button onClick={handleAddTask} size="sm" className="h-8">
          <Plus size={16} className="mr-2" />
          New Task
        </Button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              Priority
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {priorityFilters.map((f) => (
              <DropdownMenuItem
                key={f.value?.toString() || 'null'}
                onSelect={() => setPriorityFilter(f.value)}
              >
                {f.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              Category
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setCategoryFilter(null)}>
              All Categories
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem
                key={category.id}
                onSelect={() => setCategoryFilter(category.id)}
              >
                <span 
                  className="h-2 w-2 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedTaskIds.length > 0 && (
        <div className="bg-accent p-2 rounded-lg mb-4 flex items-center justify-between">
          <span className="text-sm font-medium ml-2">
            {selectedTaskIds.length} selected
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={markSelectedTasksAsCompleted}
            >
              <CheckSquare size={14} className="mr-2" />
              Complete
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={deleteSelectedTasks}
              className="text-destructive"
            >
              <Trash2 size={14} className="mr-2" />
              Delete
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearSelectedTasks}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-1 pr-4"
                >
                  {filteredTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <TaskItem 
                            task={task} 
                            dragHandleProps={provided.dragHandleProps}
                          />
                          <Separator className="my-1" />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ScrollArea>
      )}
    </div>
  );
};