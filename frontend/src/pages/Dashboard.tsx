// メインのタスク一覧画面

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { MoodIndicator } from '../components/common/MoodIndicator';
import { LogOut, CheckSquare, User, Tag } from 'lucide-react';
import { Button } from '../components/common/Button';
import { getCategories } from '../services/categoryApi';
import type { CategoryResponse } from '../types/api';

export const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { tasks, isLoading, error, createTask, toggleTaskCompletion, deleteTask } = useTasks();
    const [categories, setCategories] = useState<CategoryResponse[]>([]);

    // カテゴリを取得
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckSquare className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-xl font-bold text-slate-900">Toきょうでぃずにーらんdo</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/categories"
                            className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                            <Tag className="w-4 h-4" />
                            カテゴリ
                        </Link>
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                            <User className="w-4 h-4" />
                            {user?.username}
                        </Link>
                        <Button variant="ghost" size="sm" onClick={logout}>
                            <LogOut className="w-4 h-4 mr-1" />
                            ログアウト
                        </Button>
                    </div>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="space-y-6">
                    {/* 進捗インジケーター */}
                    <MoodIndicator />

                    {/* タスク作成フォーム */}
                    <TaskForm onSubmit={createTask} categories={categories} />

                    {/* タスク一覧 */}
                    <TaskList
                        tasks={tasks}
                        isLoading={isLoading}
                        error={error}
                        onToggle={toggleTaskCompletion}
                        onDelete={deleteTask}
                        categories={categories}
                    />
                </div>
            </main>
        </div>
    );
};