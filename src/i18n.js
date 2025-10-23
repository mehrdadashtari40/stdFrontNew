
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import XHR from 'i18next-xhr-backend';

i18n
.use(XHR)
.use(initReactI18next)
.init({
  debug: false,
  fallbackLng:localStorage.getItem("lang") == null ? "fa" :localStorage.getItem("lang") ,
  keySeparator: false,
  interpolation: {
    escapeValue: false
  },
  backend: {
    loadPath: '/{{lng}}.json',
    allowMultiLoading: true
  },
  react: {
    wait: true,
    useSuspense: true
    

  }
});

export default i18n;