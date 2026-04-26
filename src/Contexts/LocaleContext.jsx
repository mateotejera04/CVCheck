import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../i18n/translations";

const LocaleContext = createContext(null);

const getNestedValue = (source, path) =>
  path.split(".").reduce((value, key) => value?.[key], source);

const getInitialLocale = () => {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem("cvcheck-locale");
  if (saved === "en" || saved === "es") return saved;
  return window.navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
};

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(getInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem("cvcheck-locale", locale);
  }, [locale]);

  const value = useMemo(() => {
    const t = (key, fallback = key) =>
      getNestedValue(translations[locale], key) ??
      getNestedValue(translations.en, key) ??
      fallback;

    return {
      locale,
      setLocale,
      toggleLocale: () => setLocale((current) => (current === "en" ? "es" : "en")),
      t,
    };
  }, [locale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
};
