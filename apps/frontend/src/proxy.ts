import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  
  // ОТКЛЮЧАЕМ автоопределение языка по заголовкам браузера (Accept-Language),
  // чтобы middleware не перенаправлял вас обратно на /ru из-за настроек системы
  localeDetection: false,
});

export const config = {
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
