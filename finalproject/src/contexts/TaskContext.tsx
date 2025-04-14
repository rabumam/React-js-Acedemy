// src/context/tasks.tsx
"use client";

import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { Task, Category, PriorityLevel, FilterOption, SortOption, DateFilterOption, SubTask, ActionHistory } from '@/types';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';
import { format, isToday, isThisWeek, isThisMonth, isBefore, startOfDay } from 'date-fns';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Work', color: '#7C3AED' },
  { id: '2', name: 'Personal', color: '#F97316' },
  { id: '3', name: 'Shopping', color: '#4ADE80' },
  { id: '4', name: 'Health', color: '#06B6D4' },
];

type TaskContextType = {
  // ... (keep all type declarations exactly as in original)
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  // ... (keep all state declarations exactly as in original)

  useEffect(() => {
    if (user) {
      const savedTasks = localStorage.getItem(`tasks_${user.id}`);
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      
      const savedCategories = localStorage.getItem(`categories_${user.id}`);
      if (savedCategories) setCategories(JSON.parse(savedCategories));
    }
  }, [user]);

  // ... (keep all useEffect and handler implementations exactly as in original)

  const filteredTasks = useMemo(() => {
    // ... (keep filtering logic exactly as in original)
  }, [tasks, user, filter, categoryFilter, priorityFilter, dateFilter, sortOption, searchQuery]);

  return (
    <TaskContext.Provider
      value={{
        // ... (keep all value properties exactly as in original)
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTask must be used within a TaskProvider');
  return context;
};