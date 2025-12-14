export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;
export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

// Task interface matching backend schema
export interface Task {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  priority: string; // "low" | "medium" | "high"
  deadline?: string; // ISO datetime string
  created_at: string;
  owner_id: number;
}

// User interface matching backend schema
export interface User {
  id: number;
  username: string;
}

// Legacy types for backward compatibility (can be removed later)
export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const;
export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export type Category = 'PERSONAL' | 'WORK' | 'SHOPPING' | 'HEALTH' | 'FINANCE';

