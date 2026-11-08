'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, CheckCircle2, XCircle, Clock, Activity, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Log {
  id: string;
  statusCode: number;
  responseTime: number;
  isUp: boolean;
  errorMessage?: string;
  checkedAt: string;
}

interface Monitor {
  id: string;
  name: string;
  url: string;
  interval: number;
  isActive: boolean;
}

interface Stats {
  uptime: number;
  avgResponseTime: number;
  totalChecks: number;
}

function MonitorDetailsContent() {
  const t = useTranslations('MonitorDetails');
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [monitor, setMonitor] = useState<Monitor | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = async (currentPage: number) => {
    if (!id) return;
    try {
      const logsRes = await api.get(`/monitors/${id}/logs?page=${currentPage}&limit=10`);
      
      setMonitor(logsRes.data.monitor || null);
      setLogs(logsRes.data.logs || []);
      setTotalPages(logsRes.data.totalPages || 1);

      try {
        const statsRes = await api.get(`/monitors/${id}/stats`);
        setStats(statsRes.data || null);
      } catch (statErr) {
        console.error('Не удалось загрузить статистику:', statErr);
      }

    } catch (err) {
      console.error('Ошибка загрузки монитора:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
    const interval = setInterval(() => fetchData(page), 10000);
    return () => clearInterval(interval);
  }, [id, page]);

  if (loading && !monitor) {
    return <div className="text-gray-500">{t('loadingMonitor')}</div>;
  }

  if (!monitor) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">{t('notFound')}</p>
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="text-indigo-400 hover:underline text-sm font-medium"
        >
          {t('backToDashboard')}
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> {t('backToDashboard')}
      </button>

      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">{monitor.name}</h1>
            <a href={monitor.url} target="_blank" rel="noreferrer" className="text-sm text-indigo-400 hover:underline">
              {monitor.url}
            </a>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full border ${
            monitor.isActive 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {monitor.isActive ? t('intervalBadge', { interval: monitor.interval }) : t('pausedBadge')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-emerald-400 text-sm mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-gray-400">{t('uptimeLabel')}</span>
          </div>
          <p className="text-3xl font-bold">{stats?.uptime ?? 100}%</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-indigo-400 text-sm mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-gray-400">{t('avgPingLabel')}</span>
          </div>
          <p className="text-3xl font-bold">
            {stats?.avgResponseTime ?? 0} <span className="text-sm font-normal text-gray-500">{t('ms')}</span>
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-violet-400 text-sm mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-gray-400">{t('totalChecksLabel')}</span>
          </div>
          <p className="text-3xl font-bold">{stats?.totalChecks ?? 0}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-500" /> {t('responseHistoryTitle')}
      </h2>

      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-4">{t('responseChartSubtitle')}</h3>
        <div className="flex items-end gap-1.5 h-28 pt-4 border-b border-gray-800 pb-2">
          {logs.slice().reverse().map((log) => {
            const heightPercent = Math.min(Math.max((log.responseTime / 1000) * 100, 10), 100);
            const barColor = !log.isUp 
              ? 'bg-red-500' 
              : log.responseTime > 500 
                ? 'bg-amber-500' 
                : 'bg-emerald-500';

            return (
              <div key={log.id} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-xs text-white px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10 shadow-lg border border-gray-700">
                  {log.responseTime}{t('ms')} ({new Date(log.checkedAt).toLocaleTimeString()})
                </div>
                <div 
                  style={{ height: `${heightPercent}%` }} 
                  className={`w-full rounded-t transition-all duration-300 ${barColor}`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>{t('older')}</span>
          <span>{t('newer')}</span>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-500" /> {t('logsTitle')}
      </h2>
      
      {!Array.isArray(logs) || logs.length === 0 ? (
        <p className="text-gray-500">{t('noLogs')}</p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between bg-gray-900 p-4 rounded-xl border border-gray-800"
              >
                <div className="flex items-center gap-4">
                  {log.isUp ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        {t('statusPrefix')} {log.statusCode || t('networkError')}
                      </span>
                      {log.errorMessage && (
                        <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                          {log.errorMessage}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {t('checkedAt')} {log.checkedAt ? new Date(log.checkedAt).toLocaleString() : t('na')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{log.responseTime}{t('ms')}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-800">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-gray-800 text-sm font-medium disabled:opacity-50 hover:bg-gray-700 transition"
            >
              {t('prevPage')}
            </button>
            <span className="text-sm text-gray-400">
              {t('pageInfo', { page, totalPages: totalPages || 1 })}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-lg bg-gray-800 text-sm font-medium disabled:opacity-50 hover:bg-gray-700 transition"
            >
              {t('nextPage')}
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default function MonitorDetailsPage() {
  const t = useTranslations('MonitorDetails');
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<div className="text-gray-500">{t('loading')}</div>}>
          <MonitorDetailsContent />
        </Suspense>
      </div>
    </div>
  );
}
