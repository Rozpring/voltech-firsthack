import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../common/Button';
import type { TaskCreateRequest } from '../../types/api';

interface TaskFormProps {
    onSubmit: (taskData: TaskCreateRequest) => Promise<void>;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<string>('medium');
    const [deadline, setDeadline] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        try {
            await onSubmit({
                title: title.trim(),
                description: description.trim() || undefined,
                priority,
                deadline: deadline || undefined,
            });
            // フォームをリセット
            setTitle('');
            setDescription('');
            setPriority('medium');
            setDeadline('');
            setIsExpanded(false);
        } catch (error) {
            console.error('Failed to create task:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="w-full flex items-center gap-2 p-4 bg-white rounded-lg border-2 border-dashed border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
                <Plus className="w-5 h-5" />
                <span>新しいタスクを追加</span>
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            <div className="space-y-4">
                {/* タイトル */}
                <div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="タスク名を入力..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        autoFocus
                    />
                </div>

                {/* 説明 */}
                <div>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="説明（任意）"
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                </div>

                {/* 優先度と期限 */}
                <div className="flex gap-4">
                    <div className="flex-1">
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
                    <div className="flex-1">
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
                </div>

                {/* ボタン */}
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                            setIsExpanded(false);
                            setTitle('');
                            setDescription('');
                        }}
                    >
                        キャンセル
                    </Button>
                    <Button type="submit" isLoading={isLoading} disabled={!title.trim()}>
                        追加
                    </Button>
                </div>
            </div>
        </form>
    );
};