import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'ru'] as const;
export const defaultLocale = 'en';

const messagesLoader = {
  en: () => import('./messages/en.json').then((module) => module.default),
  ru: () => import('./messages/ru.json').then((module) => module.default),
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  const loader = messagesLoader[locale as keyof typeof messagesLoader];
  if (!loader) {
    notFound();
  }

  return {
    locale,
    messages: await loader(),
  };
});
