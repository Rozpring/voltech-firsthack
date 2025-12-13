import React from 'react';
import { Check, Trash2, Clock, AlertCircle } from 'lucide-react';
import type { Task } from '../../types';

interface TaskItemProps {
    task: Task;
    onToggle: (taskId: number, isCompleted: boolean) => void;
    onDelete: (taskId: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
    const isOverdue = task.deadline && !task.is_completed && new Date(task.deadline) < new Date();

    const priorityColors = {
        high: 'bg-red-100 text-red-700 border-red-200',
        medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        low: 'bg-green-100 text-green-700 border-green-200',
    };

    const priorityLabels = {
        high: '高',
        medium: '中',
        low: '低',
    };

    const formatDeadline = (deadline: string) => {
        const date = new Date(deadline);
        return date.toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div
            className={`group bg-white rounded-lg border p-4 transition-all hover:shadow-md ${task.is_completed ? 'opacity-60 border-slate-200' : 'border-slate-200'
                } ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}
        >
            <div className="flex items-start gap-3">
                {/* チェックボックス */}
                <button
                    onClick={() => onToggle(task.id, !task.is_completed)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.is_completed
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 hover:border-indigo-400'
                        }`}
                >
                    {task.is_completed && <Check className="w-4 h-4" />}
                </button>

                {/* タスク内容 */}
                <div className="flex-1 min-w-0">
                    <h3
                        className={`text-sm font-medium ${task.is_completed ? 'text-slate-400 line-through' : 'text-slate-900'
                            }`}
                    >
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="mt-1 text-sm text-slate-500 truncate">{task.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                        {/* 優先度バッジ */}
                        <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${priorityColors[task.priority as keyof typeof priorityColors] ||
                                priorityColors.medium
                                }`}
                        >
                            {priorityLabels[task.priority as keyof typeof priorityLabels] || '中'}
                        </span>

                        {/* 期限 */}
                        {task.deadline && (
                            <span
                                className={`inline-flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600' : 'text-slate-500'
                                    }`}
                            >
                                {isOverdue ? (
                                    <AlertCircle className="w-3 h-3" />
                                ) : (
                                    <Clock className="w-3 h-3" />
                                )}
                                {formatDeadline(task.deadline)}
                            </span>
                        )}
                    </div>
                </div>

                {/* 削除ボタン */}
                <button
                    onClick={() => onDelete(task.id)}
                    className="flex-shrink-0 p-1 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};