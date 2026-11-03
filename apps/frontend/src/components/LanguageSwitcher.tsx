'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { locales } from '@/i18n';
import { Globe, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const languageNames: Record<string, string> = {
  en: 'English',
  ru: 'Русский',
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    setIsOpen(false);
    if (newLocale === locale) return;

    // 1. Обновляем cookie NEXT_LOCALE
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // 2. Безопасный редирект через next-intl router (он сам заменит сегмент [locale])
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Кнопка открытия селекта */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 hover:border-gray-700 transition text-sm font-medium text-gray-200"
      >
        <Globe className="w-4 h-4 text-indigo-400" />
        <span>{languageNames[locale] || locale.toUpperCase()}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="p-1 space-y-0.5">
            {locales.map((cur) => {
              const isActive = cur === locale;
              return (
                <button
                  key={cur}
                  type="button"
                  onClick={() => handleLocaleChange(cur)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between ${
                    isActive
                      ? 'bg-indigo-600/10 text-indigo-400 font-semibold'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span>{languageNames[cur] || cur.toUpperCase()}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
