import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    lng: 'et', // vaikimisi keel
    fallbackLng: 'et',
    interpolation: {
      escapeValue: false, // react juba kaitseb xss eest
    },
    resources: {
      et: {
        translation: {
          nav: {
            calendar: 'Reisikalender',
            packages: 'Reisipaketid',
            contact: 'Kontakt',
            login: 'Logi sisse'
          }
        },
      },
    },
  });

export default i18n;
