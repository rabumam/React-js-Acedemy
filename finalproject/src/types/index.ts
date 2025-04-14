// src/types/index.ts

// Core Types
export type TaskStatus = 'active' | 'completed';
export type PriorityLevel = 'low' | 'medium' | 'high';
export type FilterOption = 'all' | 'active' | 'completed';
export type DateFilterOption = 'all' | 'today' | 'thisWeek' | 'thisMonth' | 'overdue';
export type SortOption = 'createdAt' | 'dueDate' | 'priority' | 'alphabetical';
export type ThemeOption = 'light' | 'dark' | 'system';
export type ActionType = 
  | 'add_task' 
  | 'update_task' 
  | 'delete_task' 
  | 'toggle_status'
  | 'add_category'
  | 'update_category'
  | 'delete_category'
  | 'add_subtask'
  | 'update_subtask'
  | 'delete_subtask';

// Task Types
export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: PriorityLevel;
  dueDate?: Date;
  categoryId?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  subTasks: SubTask[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Analytics Types
export interface TasksByCategory {
  category: string;
  count: number;
}

export interface TasksByStatus {
  status: TaskStatus;
  count: number;
}

export interface TasksByPriority {
  priority: PriorityLevel;
  count: number;
}

export interface TasksByDate {
  date: string;
  count: number;
}

// Settings Types
export interface AppSettings {
  theme: ThemeOption;
  defaultView: 'list' | 'calendar' | 'kanban';
  showCompletedTasks: boolean;
  defaultSortOption: SortOption;
  defaultPriorityFilter: PriorityLevel | null;
  notificationsEnabled: boolean;
}

// History Types
export interface ActionHistory {
  type: ActionType;
  taskId?: string;
  categoryId?: string;
  subtaskId?: string;
  prevState?: Task | Category | SubTask;
  timestamp: Date;
}

// Utility Types
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = {
  [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
}[Keys];
export { Button, buttonVariants } from './button';
export type { ButtonProps } from './button';