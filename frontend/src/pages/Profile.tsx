// プロフィール画面

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { User, ArrowLeft, LogOut, Camera, Save } from 'lucide-react';
import { apiClient } from '../utils/apiClient';

export const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const [displayName, setDisplayName] = useState(user?.display_name || '');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ローカルストレージからアバターを読み込む
    useEffect(() => {
        const savedAvatar = localStorage.getItem(`avatar_${user?.id}`);
        if (savedAvatar) {
            setAvatarPreview(savedAvatar);
        }
        if (user?.display_name) {
            setDisplayName(user.display_name);
        }
    }, [user]);

    // アイコン画像の選択
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    // 画像ファイルの処理
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setAvatarPreview(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    // プロフィール保存
    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage('');
        try {
            // アバターをローカルストレージに保存
            if (avatarPreview && user?.id) {
                localStorage.setItem(`avatar_${user.id}`, avatarPreview);
            }

            // 表示名をバックエンドに保存
            await apiClient.put('/api/v1/users/me', {
                display_name: displayName || null,
                avatar_url: avatarPreview || null,
            });

            setSaveMessage('プロフィールを保存しました！');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            setSaveMessage('保存に失敗しました');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="text-slate-600 hover:text-slate-900 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h2 className="text-xl font-bold text-slate-900">プロフィール</h2>
                    </div>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    {/* プロフィールヘッダー */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-12">
                        <div className="flex flex-col items-center">
                            {/* アバター画像（クリックで選択） */}
                            <div
                                className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg cursor-pointer group"
                                onClick={handleAvatarClick}
                            >
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="アイコン"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white flex items-center justify-center">
                                        <User className="w-12 h-12 text-indigo-600" />
                                    </div>
                                )}
                                {/* ホバー時のオーバーレイ */}
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <p className="mt-2 text-sm text-white/80">クリックして画像を変更</p>
                            <h3 className="mt-2 text-2xl font-bold text-white">
                                {displayName || user?.username || 'ユーザー'}
                            </h3>
                        </div>
                    </div>

                    {/* プロフィール情報 */}
                    <div className="p-6 space-y-6">
                        {/* 保存メッセージ */}
                        {saveMessage && (
                            <div className={`p-3 rounded-md text-sm ${saveMessage.includes('失敗')
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : 'bg-green-50 text-green-700 border border-green-200'
                                }`}>
                                {saveMessage}
                            </div>
                        )}

                        {/* 表示名入力 */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-slate-900">表示名</h4>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="表示名を入力"
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <Button
                                    variant="primary"
                                    onClick={handleSave}
                                    isLoading={isSaving}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    保存
                                </Button>
                            </div>
                        </div>

                        {/* ユーザー情報 */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-slate-900">ユーザー情報</h4>
                            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">ユーザー名</span>
                                    <span className="text-sm font-medium text-slate-900">
                                        {user?.username || '未設定'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">ユーザーID</span>
                                    <span className="text-sm font-medium text-slate-900">
                                        {user?.id || '-'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* アクション */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-slate-900">アカウント操作</h4>
                            <div className="space-y-3">
                                <Button
                                    variant="danger"
                                    className="w-full"
                                    onClick={logout}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    ログアウト
                                </Button>
                            </div>
                        </div>

                        {/* ダッシュボードに戻る */}
                        <div className="pt-4 border-t border-slate-200">
                            <Link to="/">
                                <Button variant="secondary" className="w-full">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    ダッシュボードに戻る
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
