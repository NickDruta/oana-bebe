import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { ro } from './ro/ro'
import { ru } from './ru/ru'

const resources = {
  ro: {
    content: ro
  },
  ru: {
    content: ru
  }
}

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: localStorage.getItem('I18N_LANGUAGE') || 'ro',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupQuerystring: 'lng',
      lookupLocalStorage: 'I18N_LANGUAGE',
      caches: ['localStorage']
    }
  })

export default i18n
