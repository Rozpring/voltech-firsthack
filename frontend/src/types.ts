export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;
export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

// カテゴリ定義
export const TaskCategory = {
  HOUSEWORK: 'housework',
  WORK: 'work',
  STUDY: 'study',
} as const;
export type TaskCategory = typeof TaskCategory[keyof typeof TaskCategory];

export const CategoryLabels: Record<TaskCategory, string> = {
  housework: '🏠 家事',
  work: '💼 仕事',
  study: '📚 勉強',
};

export const CategoryColors: Record<TaskCategory, string> = {
  housework: 'bg-pink-100 text-pink-700 border-pink-200',
  work: 'bg-blue-100 text-blue-700 border-blue-200',
  study: 'bg-purple-100 text-purple-700 border-purple-200',
};

// Task interface matching backend schema
export interface Task {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  priority: string; // "low" | "medium" | "high"
  category?: string; // "housework" | "work" | "study"
  deadline?: string; // ISO datetime string
  created_at: string;
  owner_id: number;
}

// User interface matching backend schema
export interface User {
  id: number;
  username: string;
}
