"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const SUPPORTED_LOCALES = [
  { code: 'en-us', label: 'English', nativeLabel: 'English' },
  { code: 'hi-in', label: 'Hindi', nativeLabel: 'हिंदी' },
] as const;

interface LanguageSwitcherProps {
  currentLocale?: string;
}

export default function LanguageSwitcher({ currentLocale: initialLocale }: LanguageSwitcherProps) {
  const [currentLocale, setCurrentLocale] = useState<string>(initialLocale || 'en-us');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get locale from cookie on client side
    const cookieLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
      ?.split('=')[1];
    
    if (cookieLocale) {
      setCurrentLocale(cookieLocale);
    } else if (initialLocale) {
      setCurrentLocale(initialLocale);
    }
  }, [initialLocale]);

  const handleLocaleChange = async (locale: string) => {
    // Set cookie
    document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    setCurrentLocale(locale);
    setIsOpen(false);

    // Refresh the page to apply new locale
    router.refresh();
  };

  const currentLocaleData = SUPPORTED_LOCALES.find(loc => loc.code === currentLocale) || SUPPORTED_LOCALES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-300"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span>{currentLocaleData.nativeLabel}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border">
            {SUPPORTED_LOCALES.map((locale) => (
              <button
                key={locale.code}
                onClick={() => handleLocaleChange(locale.code)}
                className={cn(
                  "w-full text-left flex items-center justify-between px-4 py-2 text-sm transition-colors",
                  currentLocale === locale.code
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{locale.nativeLabel}</span>
                  <span className="text-xs text-gray-500">{locale.label}</span>
                </div>
                {currentLocale === locale.code && (
                  <span className="text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

