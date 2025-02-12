
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { englishTranslations } from './translations/en';
import { portugueseTranslations } from './translations/pt';
import { spanishTranslations } from './translations/es';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: englishTranslations
      },
      pt: {
        translation: portugueseTranslations
      },
      es: {
        translation: spanishTranslations
      }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
    }
  });

export default i18next;
