// カテゴリ管理ページ

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '../components/common/Button';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryApi';
import type { CategoryResponse, CategoryCreateRequest, CategoryUpdateRequest } from '../types/api';
import PagesBackground from '../assets/pages-background.jpg';

const PRESET_COLORS = [
    '#6366f1', // インディゴ
    '#ec4899', // ピンク
    '#f59e0b', // オレンジ
    '#10b981', // グリーン
    '#3b82f6', // ブルー
    '#8b5cf6', // パープル
    '#ef4444', // レッド
    '#06b6d4', // シアン
];

export const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 新規カテゴリ作成用
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState(PRESET_COLORS[0]);

    // 編集用
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const [editingColor, setEditingColor] = useState('');

    // カテゴリを取得
    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const data = await getCategories();
            setCategories(data);
            setError(null);
        } catch (err) {
            setError('カテゴリの取得に失敗しました');
            console.error('Failed to fetch categories:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // カテゴリ作成
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            const newCategory: CategoryCreateRequest = {
                name: newCategoryName.trim(),
                color: newCategoryColor,
            };
            await createCategory(newCategory);
            setNewCategoryName('');
            setNewCategoryColor(PRESET_COLORS[0]);
            fetchCategories();
        } catch (err) {
            console.error('Failed to create category:', err);
            setError('カテゴリの作成に失敗しました');
        }
    };

    // カテゴリ更新
    const handleUpdate = async (categoryId: number) => {
        if (!editingName.trim()) return;

        try {
            const updateData: CategoryUpdateRequest = {
                name: editingName.trim(),
                color: editingColor,
            };
            await updateCategory(categoryId, updateData);
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            console.error('Failed to update category:', err);
            setError('カテゴリの更新に失敗しました');
        }
    };

    // カテゴリ削除
    const handleDelete = async (categoryId: number) => {
        if (!window.confirm('このカテゴリを削除しますか？')) return;

        try {
            await deleteCategory(categoryId);
            fetchCategories();
        } catch (err) {
            console.error('Failed to delete category:', err);
            setError('カテゴリの削除に失敗しました');
        }
    };

    // 編集開始
    const startEditing = (category: CategoryResponse) => {
        setEditingId(category.id);
        setEditingName(category.name);
        setEditingColor(category.color);
    };

    // 編集キャンセル
    const cancelEditing = () => {
        setEditingId(null);
        setEditingName('');
        setEditingColor('');
    };

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundImage: `url(${PagesBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
            }}
        >
            {/* ヘッダー */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link
                        to="/dashboard"
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-900">カテゴリ管理</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {error && (
                    <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                        {error}
                    </div>
                )}

                {/* 新規カテゴリ作成フォーム */}
                <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
                    <h2 className="text-sm font-medium text-slate-700 mb-3">新しいカテゴリを追加</h2>
                    <form onSubmit={handleCreate} className="flex flex-wrap gap-3 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="カテゴリ名"
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex gap-1">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    type="button"
                                    key={color}
                                    onClick={() => setNewCategoryColor(color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform ${newCategoryColor === color
                                        ? 'border-slate-900 scale-110'
                                        : 'border-transparent hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                        <Button type="submit" disabled={!newCategoryName.trim()}>
                            <Plus className="w-4 h-4 mr-1" />
                            追加
                        </Button>
                    </form>
                </div>

                {/* カテゴリ一覧 */}
                <div className="bg-white rounded-lg border border-slate-200">
                    <h2 className="text-sm font-medium text-slate-700 p-4 border-b border-slate-200">
                        カテゴリ一覧
                    </h2>

                    {isLoading ? (
                        <div className="p-8 text-center text-slate-500">読み込み中...</div>
                    ) : categories.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            カテゴリがありません
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-200">
                            {categories.map((category) => (
                                <li key={category.id} className="p-4 flex items-center gap-3">
                                    {editingId === category.id ? (
                                        // 編集モード
                                        <>
                                            <div
                                                className="w-4 h-4 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: editingColor }}
                                            />
                                            <input
                                                type="text"
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                className="flex-1 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                autoFocus
                                            />
                                            <div className="flex gap-1">
                                                {PRESET_COLORS.map((color) => (
                                                    <button
                                                        type="button"
                                                        key={color}
                                                        onClick={() => setEditingColor(color)}
                                                        className={`w-6 h-6 rounded-full border-2 ${editingColor === color
                                                            ? 'border-slate-900'
                                                            : 'border-transparent'
                                                            }`}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => handleUpdate(category.id)}
                                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </>
                                    ) : (
                                        // 表示モード
                                        <>
                                            <div
                                                className="w-4 h-4 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: category.color }}
                                            />
                                            <span className="flex-1 text-slate-900">{category.name}</span>
                                            <button
                                                onClick={() => startEditing(category)}
                                                className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
};
