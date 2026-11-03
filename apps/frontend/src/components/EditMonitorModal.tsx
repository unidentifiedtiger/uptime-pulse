'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Monitor {
  id: string;
  name: string;
  url: string;
  interval: number;
  isPublic: boolean;
}

interface EditMonitorModalProps {
  monitor: Monitor | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, name: string, interval: number, isPublic?: boolean) => Promise<void>;
}

export default function EditMonitorModal({ monitor, isOpen, onClose, onSave }: EditMonitorModalProps) {
  const t = useTranslations('EditModal');
  
  const [name, setName] = useState('');
  const [interval, setIntervalVal] = useState(60);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (monitor) {
      setName(monitor.name);
      setIntervalVal(monitor.interval);
      setIsPublic(monitor.isPublic ?? false);
    }
  }, [monitor]);

  if (!isOpen || !monitor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(monitor.id, name, interval, isPublic);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 relative shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-6">{t('title')}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{t('nameLabel')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{t('intervalLabel')}</label>
            <input
              type="number"
              value={interval}
              onChange={(e) => setIntervalVal(Number(e.target.value))}
              required
              min={10}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              {t('publicLabel')}
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition disabled:opacity-50"
            >
              {loading ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
