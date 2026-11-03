'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/navigation';
import { api } from '@/lib/api';
import { Trash2, Plus, Activity, Play, Pause, Edit2, Globe, Lock } from 'lucide-react';
import { Link } from '@/navigation';
import EditMonitorModal from '@/components/EditMonitorModal';
import { useAuthUserId } from '@/hooks/useAuthUserId';
import { useTranslations } from 'next-intl';

interface Monitor {
  id: string;
  name: string;
  url: string;
  interval: number;
  isActive: boolean;
  isPublic: boolean;
}

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingMonitor, setEditingMonitor] = useState<Monitor | null>(null);
  
  const userId = useAuthUserId();
  const router = useRouter();

  const fetchMonitors = async () => {
    try {
      const res = await api.get('/monitors');
      setMonitors(res.data);
    } catch (err) {
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();

    const interval = setInterval(fetchMonitors, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/monitors', { name, url, interval: 60, timeout: 5000, isPublic });
      setName('');
      setUrl('');
      setIsPublic(false);
      fetchMonitors();
    } catch (err: any) {
      alert(err.response?.data?.message || t('errorCreate'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/monitors/${id}`);
      setMonitors(monitors.filter((m) => m.id !== id));
    } catch (err) {
      alert(t('errorDelete'));
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await api.patch(`/monitors/${id}/toggle`);
      fetchMonitors();
    } catch (err) {
      console.error('Не удалось изменить статус монитора', err);
    }
  };

  const handleTogglePublic = async (monitor: Monitor) => {
    try {
      await api.patch(`/monitors/${monitor.id}`, { isPublic: !monitor.isPublic });
      fetchMonitors();
    } catch (err) {
      alert(t('errorPublic'));
    }
  };

  const handleUpdate = async (id: string, name: string, interval: number, isPublicVal?: boolean) => {
    try {
      await api.patch(`/monitors/${id}`, { name, interval, isPublic: isPublicVal });
      fetchMonitors();
    } catch (err: any) {
      alert(err.response?.data?.message || t('errorUpdate'));
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-indigo-500" />
            <h1 className="text-3xl font-bold">Uptime Pulse</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {userId && (
              <Link
                href={`/status/${userId}`}
                target="_blank"
                className="flex items-center gap-2 text-sm bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg hover:border-indigo-500 transition text-indigo-400"
              >
                <Globe className="w-4 h-4" /> {t('statusPageBtn')}
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                router.push('/auth');
              }}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              {t('logout')}
            </button>
          </div>
        </header>

        {/* Панель общей аналитики */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
            <p className="text-sm text-gray-400 mb-1">{t('totalMonitors')}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{monitors.length}</span>
              <span className="text-xs text-emerald-400">
                ({t('activeCount', { count: monitors.filter(m => m.isActive).length })})
              </span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
            <p className="text-sm text-gray-400 mb-1">{t('systemStatus')}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-lg font-semibold text-emerald-400">{t('statusNormal')}</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
            <p className="text-sm text-gray-400 mb-1">{t('publicMonitors')}</p>
            <p className="text-lg font-semibold text-indigo-400 mt-1">
              {t('piecesCount', { count: monitors.filter(m => m.isPublic).length })}
            </p>
          </div>
        </div>

        {/* Форма добавления */}
        <form onSubmit={handleCreate} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-8 space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-1">{t('nameLabel')}</label>
              <input
                type="text"
                placeholder={t('namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-1">{t('urlLabel')}</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              {t('publicCheckbox')}
            </label>

            <button
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-500 transition"
            >
              <Plus className="w-5 h-5" /> {t('addButton')}
            </button>
          </div>
        </form>

        {/* Список мониторов */}
        <h2 className="text-xl font-semibold mb-4">{t('yourMonitors')}</h2>
        {loading ? (
          <p className="text-gray-500">{t('loading')}</p>
        ) : monitors.length === 0 ? (
          <p className="text-gray-500">{t('noMonitors')}</p>
        ) : (
          <div className="space-y-4">
            {monitors.map((monitor) => (
              <div
                key={monitor.id}
                className="flex items-center justify-between bg-gray-900 p-5 rounded-xl border border-gray-800"
              >
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleToggle(monitor.id)}
                    className={`p-2.5 rounded-lg border transition ${
                      monitor.isActive 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                    }`}
                    title={monitor.isActive ? t('pauseTitle') : t('resumeTitle')}
                  >
                    {monitor.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <div>
                    <Link href={`/monitors/${monitor.id}`} className="font-semibold text-lg hover:text-indigo-400 transition">
                      {monitor.name}
                    </Link>
                    <a href={monitor.url} target="_blank" rel="noreferrer" className="block text-sm text-gray-500 hover:underline">
                      {monitor.url}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${
                    monitor.isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {monitor.isActive ? t('statusActive') : t('statusPaused')}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleTogglePublic(monitor)}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition ${
                      monitor.isPublic
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20'
                        : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
                    }`}
                    title={monitor.isPublic ? t('publicTitleActive') : t('publicTitlePrivate')}
                  >
                    {monitor.isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    {monitor.isPublic ? t('publicBadge') : t('privateBadge')}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingMonitor(monitor)}
                    className="text-gray-500 hover:text-indigo-400 transition p-1"
                    title={t('editTitle')}
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(monitor.id)}
                    className="text-gray-500 hover:text-red-400 transition p-1"
                    title={t('deleteTitle')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Модальное окно редактирования */}
        <EditMonitorModal
          monitor={editingMonitor}
          isOpen={!!editingMonitor}
          onClose={() => setEditingMonitor(null)}
          onSave={handleUpdate}
        />
      </div>
    </div>
  );
}
