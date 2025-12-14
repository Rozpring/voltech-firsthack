// 場所管理ページ

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, Trash2, Navigation, Edit2, Save, X } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useGeolocation } from '../hooks/useGeolocation';
import { getLocations, createLocation, updateLocation, deleteLocation } from '../services/locationApi';
import { getCategories } from '../services/categoryApi';
import type { LocationResponse, LocationCreateRequest, CategoryResponse } from '../types/api';
import PagesBackground from '../assets/pages-background.jpg';

export const LocationsPage: React.FC = () => {
    const [locations, setLocations] = useState<LocationResponse[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // 新規作成フォームの状態
    const [newLocation, setNewLocation] = useState<LocationCreateRequest>({
        name: '',
        latitude: 0,
        longitude: 0,
        radius: 500,
        category_id: null,
    });

    // 編集フォームの状態
    const [editForm, setEditForm] = useState<LocationCreateRequest>({
        name: '',
        latitude: 0,
        longitude: 0,
        radius: 500,
        category_id: null,
    });

    const geolocation = useGeolocation();

    // データ取得
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locationsData, categoriesData] = await Promise.all([
                    getLocations(),
                    getCategories()
                ]);
                setLocations(locationsData);
                setCategories(categoriesData);
            } catch (err) {
                setError('データの取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // 現在地を取得してフォームに設定
    const handleGetCurrentLocation = () => {
        geolocation.getCurrentPosition();
    };

    // 位置情報が更新されたらフォームに反映
    useEffect(() => {
        if (geolocation.latitude && geolocation.longitude) {
            if (isCreating) {
                setNewLocation(prev => ({
                    ...prev,
                    latitude: geolocation.latitude!,
                    longitude: geolocation.longitude!,
                }));
            } else if (editingId !== null) {
                setEditForm(prev => ({
                    ...prev,
                    latitude: geolocation.latitude!,
                    longitude: geolocation.longitude!,
                }));
            }
        }
    }, [geolocation.latitude, geolocation.longitude, isCreating, editingId]);

    // 場所を作成
    const handleCreate = async () => {
        if (!newLocation.name.trim()) {
            setError('場所名を入力してください');
            return;
        }

        try {
            const created = await createLocation(newLocation);
            setLocations([...locations, created]);
            setIsCreating(false);
            setNewLocation({
                name: '',
                latitude: 0,
                longitude: 0,
                radius: 500,
                category_id: null,
            });
            setError(null);
        } catch (err) {
            setError('場所の作成に失敗しました');
        }
    };

    // 編集開始
    const handleEditStart = (location: LocationResponse) => {
        setEditingId(location.id);
        setEditForm({
            name: location.name,
            latitude: location.latitude,
            longitude: location.longitude,
            radius: location.radius,
            category_id: location.category_id,
        });
    };

    // 編集保存
    const handleEditSave = async () => {
        if (editingId === null) return;

        try {
            const updated = await updateLocation(editingId, editForm);
            setLocations(locations.map(loc =>
                loc.id === editingId ? updated : loc
            ));
            setEditingId(null);
            setError(null);
        } catch (err) {
            setError('場所の更新に失敗しました');
        }
    };

    // 場所を削除
    const handleDelete = async (id: number) => {
        if (!confirm('この場所を削除しますか？')) return;

        try {
            await deleteLocation(id);
            setLocations(locations.filter(loc => loc.id !== id));
        } catch (err) {
            setError('場所の削除に失敗しました');
        }
    };

    // カテゴリ名を取得
    const getCategoryName = (categoryId: number | null | undefined) => {
        if (!categoryId) return '未設定';
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : '未設定';
    };

    // カテゴリの色を取得
    const getCategoryColor = (categoryId: number | null | undefined) => {
        if (!categoryId) return '#6B7280';
        const category = categories.find(c => c.id === categoryId);
        return category ? category.color : '#6B7280';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-slate-500">読み込み中...</div>
            </div>
        );
    }

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
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-slate-600 hover:text-slate-900">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-indigo-600" />
                            <h1 className="text-xl font-bold text-slate-900">場所管理</h1>
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setIsCreating(true)}
                        disabled={isCreating}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        新規追加
                    </Button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {/* 新規作成フォーム */}
                {isCreating && (
                    <div className="mb-6 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold mb-4">新しい場所を追加</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    場所名
                                </label>
                                <input
                                    type="text"
                                    value={newLocation.name}
                                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                                    placeholder="例: 自宅、学校、会社"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        緯度
                                    </label>
                                    <input
                                        type="number"
                                        step="0.000001"
                                        value={newLocation.latitude}
                                        onChange={(e) => setNewLocation({ ...newLocation, latitude: parseFloat(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        経度
                                    </label>
                                    <input
                                        type="number"
                                        step="0.000001"
                                        value={newLocation.longitude}
                                        onChange={(e) => setNewLocation({ ...newLocation, longitude: parseFloat(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleGetCurrentLocation()}
                                disabled={geolocation.loading}
                            >
                                <Navigation className="w-4 h-4 mr-1" />
                                {geolocation.loading ? '取得中...' : '現在地を取得'}
                            </Button>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    エリア半径（メートル）
                                </label>
                                <input
                                    type="number"
                                    value={newLocation.radius}
                                    onChange={(e) => setNewLocation({ ...newLocation, radius: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    紐づけるカテゴリ
                                </label>
                                <select
                                    value={newLocation.category_id || ''}
                                    onChange={(e) => setNewLocation({
                                        ...newLocation,
                                        category_id: e.target.value ? parseInt(e.target.value) : null
                                    })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">カテゴリを選択</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="primary" onClick={handleCreate}>
                                    <Save className="w-4 h-4 mr-1" />
                                    保存
                                </Button>
                                <Button variant="ghost" onClick={() => setIsCreating(false)}>
                                    <X className="w-4 h-4 mr-1" />
                                    キャンセル
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 場所一覧 */}
                <div className="space-y-4">
                    {locations.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>登録された場所がありません</p>
                            <p className="text-sm mt-2">「新規追加」から場所を登録してください</p>
                        </div>
                    ) : (
                        locations.map(location => (
                            <div
                                key={location.id}
                                className="bg-white rounded-lg shadow-sm border border-slate-200 p-4"
                            >
                                {editingId === location.id ? (
                                    // 編集モード
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="number"
                                                step="0.000001"
                                                value={editForm.latitude}
                                                onChange={(e) => setEditForm({ ...editForm, latitude: parseFloat(e.target.value) })}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <input
                                                type="number"
                                                step="0.000001"
                                                value={editForm.longitude}
                                                onChange={(e) => setEditForm({ ...editForm, longitude: parseFloat(e.target.value) })}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleGetCurrentLocation()}
                                            disabled={geolocation.loading}
                                        >
                                            <Navigation className="w-4 h-4 mr-1" />
                                            {geolocation.loading ? '取得中...' : '現在地を取得'}
                                        </Button>
                                        <input
                                            type="number"
                                            value={editForm.radius}
                                            onChange={(e) => setEditForm({ ...editForm, radius: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="半径（メートル）"
                                        />
                                        <select
                                            value={editForm.category_id || ''}
                                            onChange={(e) => setEditForm({
                                                ...editForm,
                                                category_id: e.target.value ? parseInt(e.target.value) : null
                                            })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">カテゴリを選択</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <div className="flex gap-2">
                                            <Button variant="primary" size="sm" onClick={handleEditSave}>
                                                <Save className="w-4 h-4 mr-1" />
                                                保存
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                                                <X className="w-4 h-4 mr-1" />
                                                キャンセル
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    // 表示モード
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <MapPin
                                                    className="w-5 h-5"
                                                    style={{ color: getCategoryColor(location.category_id) }}
                                                />
                                                <h3 className="font-semibold text-slate-900">{location.name}</h3>
                                            </div>
                                            <div className="text-sm text-slate-500 space-y-1">
                                                <p>座標: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
                                                <p>半径: {location.radius}m</p>
                                                <p>
                                                    カテゴリ:
                                                    <span
                                                        className="ml-1 px-2 py-0.5 rounded-full text-xs text-white"
                                                        style={{ backgroundColor: getCategoryColor(location.category_id) }}
                                                    >
                                                        {getCategoryName(location.category_id)}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditStart(location)}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(location.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};
