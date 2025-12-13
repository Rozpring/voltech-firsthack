import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import LogoSource from '../../assets/ミッキー.jpg';
//import { CheckSquare } from 'lucide-react';

const LogoImage: React.FC = () => (
  <img 
    src={LogoSource}
    alt="アプリケーションロゴ" 
    className="h-40 w-auto" 
  />
);

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <LogoImage /> 
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          ログイン
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          アカウントをお持ちでない場合は <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">新規登録</Link>
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
              <label className="block text-sm font-medium text-slate-700">ユーザー名</label>
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
              <label className="block text-sm font-medium text-slate-700">パスワード</label>
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
              <Button type="submit" className="w-full" isLoading={loading} variant="primary">
                ログイン
              </Button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};