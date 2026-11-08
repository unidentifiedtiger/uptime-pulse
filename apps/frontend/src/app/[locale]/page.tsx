'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/navigation';
import { Activity, Shield, Zap, Bell, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LandingPage() {
  const t = useTranslations('Landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-indigo-500 selection:text-white">
      <header className="border-b border-gray-900/50 backdrop-blur-md sticky top-0 z-50 bg-gray-950/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-7 h-7 text-indigo-500" />
            <span className="font-bold text-xl tracking-tight">Uptime Pulse</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20"
              >
                <LayoutDashboard className="w-4 h-4" /> {t('dashboard')}
              </Link>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="text-sm font-medium text-gray-300 hover:text-white transition"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/auth"
                  className="bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20"
                >
                  {t('getStarted')}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="pt-24 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            {t('badge')}
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            {t('titleMain')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              {t('titleHighlight')}
            </span>
          </h1>

          <p className="text-lg text-gray-400 mb-10 leading-relaxed">
            {t('description')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-8 py-3.5 rounded-xl font-semibold transition shadow-xl shadow-indigo-600/30 text-base"
              >
                {t('goToDashboard')} <LayoutDashboard className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/auth"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-8 py-3.5 rounded-xl font-semibold transition shadow-xl shadow-indigo-600/30 text-base"
              >
                {t('startMonitoring')} <ArrowRight className="w-5 h-5" />
              </Link>
            )}
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold bg-gray-900 border border-gray-800 hover:bg-gray-800 transition text-base text-gray-300"
            >
              {t('learnMore')}
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 border-t border-gray-900/50 bg-gray-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('featuresTitle')}</h2>
            <p className="text-gray-400">{t('featuresSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 border border-gray-800/80 p-8 rounded-2xl backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('feature1Title')}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{t('feature1Desc')}</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800/80 p-8 rounded-2xl backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('feature2Title')}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{t('feature2Desc')}</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800/80 p-8 rounded-2xl backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('feature3Title')}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{t('feature3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-900/50 py-8 px-6 text-center text-sm text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            <span className="font-semibold text-gray-400">Uptime Pulse</span>
          </div>
          <p>© {new Date().getFullYear()} {t('rights')}</p>
        </div>
      </footer>
    </div>
  );
}
