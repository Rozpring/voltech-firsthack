import React from 'react';
import { TaskItem } from './TaskItem';
import type { Task } from '../../types';
import { Loader2, ListTodo } from 'lucide-react';

interface TaskListProps {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    onToggle: (taskId: number, isCompleted: boolean) => void;
    onDelete: (taskId: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
    tasks,
    isLoading,
    error,
    onToggle,
    onDelete,
}) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center py-12">
                <ListTodo className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600">タスクがありません</h3>
                <p className="text-sm text-slate-400 mt-1">
                    新しいタスクを追加してみましょう
                </p>
            </div>
        );
    }

    const incompleteTasks = tasks.filter((t) => !t.is_completed);
    const completedTasks = tasks.filter((t) => t.is_completed);

    return (
        <div className="space-y-6">
            {/* 未完了タスク */}
            {incompleteTasks.length > 0 && (
                <div>
                    <h2 className="text-sm font-medium text-slate-500 mb-3">
                        未完了 ({incompleteTasks.length})
                    </h2>
                    <div className="space-y-2">
                        {incompleteTasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={onToggle}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* 完了タスク */}
            {completedTasks.length > 0 && (
                <div>
                    <h2 className="text-sm font-medium text-slate-500 mb-3">
                        完了 ({completedTasks.length})
                    </h2>
                    <div className="space-y-2">
                        {completedTasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={onToggle}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};