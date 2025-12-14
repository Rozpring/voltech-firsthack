// タスク編集モーダルコンポーネント

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';
import type { Task } from '../../types';
import type { TaskUpdateRequest, CategoryResponse } from '../../types/api';

interface TaskEditModalProps {
    task: Task;
    categories: CategoryResponse[];
    onSave: (taskId: number, data: TaskUpdateRequest) => Promise<void>;
    onClose: () => void;
}

// 優先度の数値から文字列に変換
const priorityToString = (priority: string | number): string => {
    if (typeof priority === 'string') return priority;
    switch (priority) {
        case 1: return 'low';
        case 3: return 'high';
        default: return 'medium';
    }
};

// ISO日時文字列をdatetime-local形式に変換
const toDateTimeLocal = (isoString?: string): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
};

export const TaskEditModal: React.FC<TaskEditModalProps> = ({
    task,
    categories,
    onSave,
    onClose,
}) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [priority, setPriority] = useState(priorityToString(task.priority));
    const [deadline, setDeadline] = useState(toDateTimeLocal(task.deadline));
    const [categoryId, setCategoryId] = useState(task.category_id?.toString() || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ESCキーで閉じる
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('タスク名は必須です');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await onSave(task.id, {
                title: title.trim(),
                description: description.trim() || undefined,
                priority,
                deadline: deadline || undefined,
                category_id: categoryId ? Number(categoryId) : undefined,
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'タスクの更新に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* オーバーレイ */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* モーダル */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                {/* ヘッダー */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">タスクを編集</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* フォーム */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* タイトル */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            タスク名 *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            autoFocus
                        />
                    </div>

                    {/* 説明 */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            説明
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* 優先度 */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            優先度
                        </label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="low">低</option>
                            <option value="medium">中</option>
                            <option value="high">高</option>
                        </select>
                    </div>

                    {/* 期限 */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            期限
                        </label>
                        <input
                            type="datetime-local"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* カテゴリ */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            カテゴリ
                        </label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">カテゴリなし</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ボタン */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            キャンセル
                        </Button>
                        <Button type="submit" isLoading={isLoading} disabled={!title.trim()}>
                            保存
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
