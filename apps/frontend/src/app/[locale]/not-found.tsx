'use client';

import { Link } from '@/navigation';
import { Activity, ArrowLeft, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('NotFound');
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between p-6 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none" />

      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3">
          <Activity className="w-7 h-7 text-indigo-500" />
          <span className="font-bold text-xl tracking-tight">Uptime Pulse</span>
        </Link>
      </header>

      <main className="max-w-md mx-auto text-center z-10 py-12">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-6">
          {t('badge')}
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          {t('title')}
        </h1>

        <p className="text-gray-400 text-base mb-8 leading-relaxed">
          {t('description')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-semibold transition shadow-lg shadow-indigo-600/20 text-sm"
          >
            <Home className="w-4 h-4" /> {t('dashboard')}
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 px-6 py-3 rounded-xl font-semibold transition text-sm text-gray-300"
          >
            <ArrowLeft className="w-4 h-4" /> {t('home')}
          </Link>
        </div>
      </main>

      <footer className="text-center text-xs text-gray-600 z-10">
        © {year} Uptime Pulse. {t('rights')}
      </footer>
    </div>
  );
}
