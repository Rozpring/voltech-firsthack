import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import LogoSource from '../../assets/ミッキー.jpg';
import LeftLogo from '../../assets/left-logo.png';
import BackgroundImage from '../../assets/login-background.png';
//import { CheckSquare } from 'lucide-react';

const LogoImage: React.FC = () => (
    <div className="flex items-center justify-start gap-1">
        <img
            src={LeftLogo}
            alt="吹き出し"
            className="h-80 w-auto"
        />
        <img
            src={LogoSource}
            alt="アプリケーションロゴ"
            className="h-64 w-auto"
        />
    </div>
);


export const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('パスワードが一致しません');
            return;
        }

        if (password.length < 4) {
            setError('パスワードは4文字以上で入力してください');
            return;
        }

        setLoading(true);
        try {
            await register(username, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || '登録に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
            style={{
                backgroundImage: `url(${BackgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-start ml-[-200px]">
                    <LogoImage />
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
                    新規登録
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    アカウントをお持ちの場合は{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        ログイン
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-100">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                ユーザー名
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="ユーザー名を入力"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                パスワード
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="パスワードを入力"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                パスワード確認
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="パスワードを再入力"
                                />
                            </div>
                        </div>

                        <div>
                            <Button type="submit" className="w-full" isLoading={loading}>
                                登録
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};