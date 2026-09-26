"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  getAdminMessages,
  type AdminMessages,
  type Locale,
} from "@/lib/admin-i18n";

export function useAdminLocale() {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
      if (stored === "sq" || stored === "en" || stored === "sr") {
        setLocaleState(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const t: AdminMessages = getAdminMessages(locale);

  return { locale, setLocale, t };
}
