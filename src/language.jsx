import { createContext, useContext, useLayoutEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'pt'; }
    catch { return 'pt'; }
  });

  useLayoutEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    document.title = language === 'pt'
      ? 'Enzo Fernandes | Desenvolvimento, dados & IA'
      : 'Enzo Fernandes | Development, data & AI';
    try { localStorage.setItem('portfolio-language', language); } catch {}
  }, [language]);

  const value = useMemo(() => ({
    language,
    locale: language === 'pt' ? 'pt-BR' : 'en-US',
    tr: (pt, en) => language === 'pt' ? pt : en,
    setLanguage,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function Text({ as: Tag = 'span', pt, en, ...props }) {
  const { tr } = useLanguage();
  return <Tag {...props} data-pt={pt} data-en={en}>{tr(pt, en)}</Tag>;
}
