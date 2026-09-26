"use client";

import { LOCALE_OPTIONS, type Locale } from "@/lib/admin-i18n";

type Props = {
  locale: Locale;
  onChange: (locale: Locale) => void;
  className?: string;
};

export default function LangSwitcher({ locale, onChange, className }: Props) {
  return (
    <div
      className={`lang-switch shrink-0 ${className ?? ""}`}
      role="navigation"
      aria-label="Language Switcher"
    >
      {LOCALE_OPTIONS.map((option, index) => (
        <span key={option.id} className="inline-flex items-center">
          {index > 0 && <span className="px-0.5 text-[#cfd8e3]">/</span>}
          <button
            type="button"
            lang={option.lang}
            aria-current={locale === option.id ? "true" : undefined}
            onClick={() => onChange(option.id)}
            className={
              locale === option.id
                ? "bg-[#04408b] text-white"
                : "text-[#54595f] hover:text-[#04408b]"
            }
          >
            {option.label}
          </button>
        </span>
      ))}
    </div>
  );
}
