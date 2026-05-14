import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from '@/lib/i18n-config'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip public assets and internal next paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.json'
  ) {
    return
  }

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // 1. Check for manual preference cookie
    const cookieLocale = request.cookies.get('preferred-locale')?.value
    
    // 2. Check Accept-Language header for device/browser language
    const acceptLanguage = request.headers.get('accept-language')
    
    let detectedLocale: string | undefined;
    
    if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
      detectedLocale = cookieLocale;
    } else if (acceptLanguage) {
      // Robust check: starts with tr or contains tr as a primary language
      const isTurkish = acceptLanguage.toLowerCase().split(',').some(lang => lang.trim().startsWith('tr'));
      detectedLocale = isTurkish ? 'tr' : 'en';
    }

    // Final locale decision: Manual Preference > Device Language > Fallback (English)
    const locale = detectedLocale || 'en';

    // Redirect to the detected locale
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
    )
  }
}

export const config = {
  // Matcher for all paths except static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)'],
}
