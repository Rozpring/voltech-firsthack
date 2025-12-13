// プロフィール画面

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { User, ArrowLeft, LogOut } from 'lucide-react';

export const Profile: React.FC = () => {
    const { user, logout } = useAuth();

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
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <User className="w-12 h-12 text-indigo-600" />
                            </div>
                            <h3 className="mt-4 text-2xl font-bold text-white">
                                {user?.username || 'ユーザー'}
                            </h3>
                        </div>
                    </div>

                    {/* プロフィール情報 */}
                    <div className="p-6 space-y-6">
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
