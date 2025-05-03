import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import EStranslation from './locales/es/translation.json';
import ENtranslation from './locales/en/translation.json';

const resources = {
  en: {
    translation: ENtranslation
  },
  es: {
    translation: EStranslation
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem("language"),
    fallbackLng: "es",

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;