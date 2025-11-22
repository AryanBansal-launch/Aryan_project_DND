import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const d = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

export function formatSalary(salary?: { min?: number; max?: number; currency: string; period: string }): string {
  if (!salary) return 'Salary not specified'
  
  const { min, max, currency, period } = salary
  const symbol = currency === 'USD' ? '$' : currency
  
  if (min && max) {
    return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()} ${period}`
  } else if (min) {
    return `${symbol}${min.toLocaleString()}+ ${period}`
  } else if (max) {
    return `Up to ${symbol}${max.toLocaleString()} ${period}`
  }
  return 'Salary not specified'
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function capitalizeWords(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}
/**
 * Detects user locale based on cookie preference, Accept-Language header, and supported locales
 * Falls back to 'en-us' if no match is found
 * Priority: 1. Cookie preference, 2. Accept-Language header, 3. Default
 * @param cookieLocale - Locale from cookie (optional, highest priority)
 * @param acceptLanguage - Accept-Language header value (optional)
 * @returns Locale code (e.g., 'en-us', 'hi-in')
 */
export function detectLocale(cookieLocale?: string | null, acceptLanguage?: string | null): string {
  // Supported locales in the application
  const supportedLocales = ['en-us', 'hi-in'];
  const defaultLocale = 'en-us';

  // Check cookie preference first (user's manual selection)
  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    return cookieLocale;
  }

  if (!acceptLanguage) {
    return defaultLocale;
  }

  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,hi;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [locale, q = 'q=1'] = lang.trim().split(';');
      const quality = parseFloat(q.replace('q=', '')) || 1;
      return { locale: locale.toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  // Try to match with supported locales
  for (const { locale } of languages) {
    // Exact match (e.g., "en-us")
    if (supportedLocales.includes(locale)) {
      return locale;
    }
    
    // Match language code (e.g., "hi" matches "hi-in")
    const languageCode = locale.split('-')[0];
    const matchedLocale = supportedLocales.find(supported => 
      supported.startsWith(languageCode)
    );
    if (matchedLocale) {
      return matchedLocale;
    }
  }

  // Default fallback
  return defaultLocale;
}

