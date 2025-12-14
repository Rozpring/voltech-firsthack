import React from 'react';
import { Trash2, Clock, AlertCircle, Tag, Pencil } from 'lucide-react';
import type { Task } from '../../types';
import type { CategoryResponse } from '../../types/api';

interface TaskItemProps {
    task: Task;
    onToggle: (taskId: number, isCompleted: boolean) => void;
    onDelete: (taskId: number) => void;
    onEdit: (task: Task) => void;
    categories?: CategoryResponse[];
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit, categories = [] }) => {
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

    // カテゴリを取得
    const category = task.category_id
        ? categories.find(c => c.id === task.category_id)
        : null;

    return (
        <div
            className={`group bg-white rounded-lg border p-4 transition-all hover:shadow-md ${task.is_completed ? 'opacity-60 border-slate-200' : 'border-slate-200'
                } ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}
        >
            <div className="flex items-start gap-3">
                {/* チェックボックス */}
                <button
                    onClick={() => onToggle(task.id, !task.is_completed)}
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all bg-white ${task.is_completed
                        ? 'border-green-500'
                        : 'border-slate-400 hover:border-indigo-500'
                        }`}
                >
                    {task.is_completed && (
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
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

                        {/* カテゴリバッジ */}
                        {category && (
                            <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border"
                                style={{
                                    backgroundColor: `${category.color}20`,
                                    color: category.color,
                                    borderColor: `${category.color}40`,
                                }}
                            >
                                <Tag className="w-3 h-3" />
                                {category.name}
                            </span>
                        )}

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

                {/* アクションボタン */}
                <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* 編集ボタン */}
                    <button
                        onClick={() => onEdit(task)}
                        className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                        title="編集"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    {/* 削除ボタン */}
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="削除"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};