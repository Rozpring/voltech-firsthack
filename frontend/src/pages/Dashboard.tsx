// メインのタスク一覧画面

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { DeadlineDialogue } from '../components/common/DeadlineDialogue';
import { LogOut, CheckSquare, User, Tag, MapPin, Navigation, X } from 'lucide-react';
import { Button } from '../components/common/Button';
import { getCategories } from '../services/categoryApi';
import { findNearbyLocation } from '../services/locationApi';
import { useGeolocation } from '../hooks/useGeolocation';
import type { CategoryResponse, NearbyLocationResponse } from '../types/api';
import DashboardBackground from '../assets/dashboard-background.jpg';

export const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { tasks, isLoading, error, createTask, updateTask, toggleTaskCompletion, deleteTask } = useTasks();
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [nearbyLocation, setNearbyLocation] = useState<NearbyLocationResponse | null>(null);
    const [locationFilterActive, setLocationFilterActive] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    const geolocation = useGeolocation();

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

    // 位置情報が変わったら近くの場所を検索
    useEffect(() => {
        const checkNearbyLocation = async () => {
            if (geolocation.latitude && geolocation.longitude) {
                try {
                    const nearby = await findNearbyLocation(
                        geolocation.latitude,
                        geolocation.longitude
                    );
                    setNearbyLocation(nearby);
                    if (nearby) {
                        setLocationFilterActive(true);
                        setLocationError(null);
                    }
                } catch (err) {
                    console.error('Failed to find nearby location:', err);
                }
            }
        };
        checkNearbyLocation();
    }, [geolocation.latitude, geolocation.longitude]);

    // 現在地を取得
    const handleGetLocation = () => {
        setLocationError(null);
        geolocation.getCurrentPosition();
    };

    // 位置情報エラーの処理
    useEffect(() => {
        if (geolocation.error) {
            setLocationError(geolocation.error);
        }
    }, [geolocation.error]);

    // フィルタリング済みのタスク
    const filteredTasks = useMemo(() => {
        if (!locationFilterActive || !nearbyLocation?.category_id) {
            return tasks;
        }
        return tasks.filter(task => task.category_id === nearbyLocation.category_id);
    }, [tasks, locationFilterActive, nearbyLocation]);

    // 現在のフィルタカテゴリ名
    const filterCategoryName = useMemo(() => {
        if (!nearbyLocation?.category_id) return null;
        const category = categories.find(c => c.id === nearbyLocation.category_id);
        return category?.name || null;
    }, [nearbyLocation, categories]);

    // フィルタカテゴリの色
    const filterCategoryColor = useMemo(() => {
        if (!nearbyLocation?.category_id) return '#6366f1';
        const category = categories.find(c => c.id === nearbyLocation.category_id);
        return category?.color || '#6366f1';
    }, [nearbyLocation, categories]);

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundImage: `url(${DashboardBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
            }}
        >
            {/* ヘッダー */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckSquare className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-xl font-bold text-slate-900">ToｷｮｳﾃﾞｨｽﾞﾆｰﾗﾝDo</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/locations"
                            className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                            <MapPin className="w-4 h-4" />
                            場所
                        </Link>
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
                    {/* 位置情報フィルターバー */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MapPin
                                    className="w-5 h-5"
                                    style={{ color: locationFilterActive ? filterCategoryColor : '#6B7280' }}
                                />
                                {locationFilterActive && nearbyLocation ? (
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-slate-900">
                                            📍 {nearbyLocation.name}
                                        </span>
                                        {filterCategoryName && (
                                            <span
                                                className="px-2 py-0.5 rounded-full text-xs text-white"
                                                style={{ backgroundColor: filterCategoryColor }}
                                            >
                                                {filterCategoryName}のタスクを表示中
                                            </span>
                                        )}
                                        <span className="text-xs text-slate-500">
                                            ({Math.round(nearbyLocation.distance)}m以内)
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-slate-500">
                                        位置情報でタスクをフィルタリング
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {locationFilterActive && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setLocationFilterActive(false);
                                            setNearbyLocation(null);
                                        }}
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        解除
                                    </Button>
                                )}
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleGetLocation}
                                    disabled={geolocation.loading}
                                >
                                    <Navigation className="w-4 h-4 mr-1" />
                                    {geolocation.loading ? '取得中...' : '現在地で検索'}
                                </Button>
                            </div>
                        </div>
                        {locationError && (
                            <p className="mt-2 text-sm text-red-600">{locationError}</p>
                        )}
                        {geolocation.latitude && !nearbyLocation && !locationFilterActive && (
                            <p className="mt-2 text-sm text-slate-500">
                                現在地近くに登録された場所が見つかりませんでした。
                                <Link to="/locations" className="text-indigo-600 hover:underline ml-1">
                                    場所を登録する
                                </Link>
                            </p>
                        )}
                    </div>

                    {/* 期限に関するセリフ */}
                    <DeadlineDialogue />

                    {/* タスク作成フォーム */}
                    <TaskForm onSubmit={createTask} categories={categories} />

                    {/* タスク一覧 */}
                    <TaskList
                        tasks={filteredTasks}
                        isLoading={isLoading}
                        error={error}
                        onToggle={toggleTaskCompletion}
                        onDelete={deleteTask}
                        onUpdate={updateTask}
                        categories={categories}
                    />
                </div>
            </main>
        </div>
    );
};