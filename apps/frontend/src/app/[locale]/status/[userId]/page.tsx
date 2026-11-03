'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Monitor {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  isPublic: boolean;
}

export default function StatusPage() {
  const t = useTranslations('StatusPage');
  const params = useParams();
  const userId = params.userId as string;
  
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [overallStatus, setOverallStatus] = useState<string>('up');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicMonitors = async () => {
      try {
        const res = await api.get(`/monitors/public/${userId}`);
        
        if (res.data) {
          setMonitors(res.data.monitors || []);
          setOverallStatus(res.data.overallStatus || 'up');
        }
      } catch (err) {
        console.error('Не удалось загрузить статус-страницу', err);
        setMonitors([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPublicMonitors();
    }
  }, [userId]);

  const safeMonitors = Array.isArray(monitors) ? monitors : [];
  const isAllOperational = overallStatus === 'up' || overallStatus === 'operational';

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        {/* Шапка с общим статусом */}
        <header className="flex items-center justify-between mb-8 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-indigo-500" />
            <div>
              <h1 className="text-2xl font-bold">{t('title')}</h1>
              <p className="text-sm text-gray-400">{t('subtitle')}</p>
            </div>
          </div>

          {!loading && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${
              isAllOperational 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {isAllOperational ? (
                <>
                  <CheckCircle className="w-4 h-4" /> {t('allOperational')}
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" /> {t('hasDisruptions')}
                </>
              )}
            </div>
          )}
        </header>

        {loading ? (
          <p className="text-gray-500 text-center py-8">{t('loading')}</p>
        ) : safeMonitors.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{t('noMonitors')}</p>
        ) : (
          <div className="space-y-4">
            {safeMonitors.map((monitor) => (
              <div
                key={monitor.id}
                className="flex items-center justify-between bg-gray-900 p-5 rounded-xl border border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      monitor.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  <div>
                    <span className="font-medium text-lg">{monitor.name}</span>
                    {monitor.url && (
                      <span className="block text-xs text-gray-500">{monitor.url}</span>
                    )}
                  </div>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full border ${
                    monitor.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {monitor.isActive ? t('statusActive') : t('statusStopped')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
