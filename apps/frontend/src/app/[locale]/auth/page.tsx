'use client';

import { useState } from 'react';
import { useRouter } from '@/navigation';
import { api } from '@/lib/api';
import { useTranslations } from 'next-intl';

export default function AuthPage() {
  const t = useTranslations('AuthPage');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/auth/signin' : '/auth/signup';

    try {
      const res = await api.post(endpoint, { email, password });
      localStorage.setItem('token', res.data.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || t('defaultError'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
      <div className="w-full max-w-md rounded-2xl bg-gray-900 p-8 shadow-xl border border-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? t('loginTitle') : t('registerTitle')}
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{t('emailLabel')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{t('passwordLabel')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-500 transition"
          >
            {isLogin ? t('loginButton') : t('registerButton')}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          {isLogin ? t('noAccount') : t('hasAccount')}{' '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-400 hover:underline font-medium"
          >
            {isLogin ? t('switchToRegister') : t('switchToLogin')}
          </button>
        </p>
      </div>
    </div>
  );
}
