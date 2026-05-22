import { createContext, useContext, useState, ReactNode } from 'react';
import { Locale, t } from './translations';

interface LocaleContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType>({ locale: 'en', setLocale: () => {}, t: (k) => k });

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: (key) => t(locale, key) }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
