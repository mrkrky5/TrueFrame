import type { Metadata, Viewport } from "next";
import BottomNav from "@/components/layout/BottomNav";
import Onboarding from "@/components/ui/Onboarding";
import SWRegistration from "@/components/utils/SWRegistration";
import OfflineNotification from "@/components/ui/OfflineNotification";
import { i18n, type Locale } from "@/lib/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import { DictionaryProvider } from "@/components/utils/DictionaryProvider";
import { SITE_CONFIG } from "@/lib/config";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return {
    metadataBase: new URL(SITE_CONFIG.baseUrl),
    title: {
      default: `${dictionary.common.brandingTitle} | ${dictionary.common.brandingSubtitle}`,
      template: `%s | ${dictionary.common.brandingTitle}`
    },
    description: dictionary.common.dossierDescription,
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      title: dictionary.common.brandingTitle,
    },
    icons: {
      icon: "/favicon.png",
      apple: "/apple-touch-icon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      type: "website",
      locale: lang === 'tr' ? 'tr_TR' : 'en_US',
      url: `https://medyadangercege.com/${lang}`,
      siteName: dictionary.common.brandingTitle,
      title: `${dictionary.common.brandingTitle} | ${dictionary.common.brandingSubtitle}`,
      description: dictionary.common.dossierDescription,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: dictionary.common.brandingTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${dictionary.common.brandingTitle} | ${dictionary.common.brandingSubtitle}`,
      description: dictionary.common.dossierDescription,
      images: ["/og-image.png"],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#FAF9F6",
};

export default async function LocalizedLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return (
    <div lang={lang} data-locale={lang} className="min-h-full">
      <DictionaryProvider dictionary={dictionary}>
        <div className="app-shell">
          <div className="top-system-safe-area" />
          <Onboarding />
          <main className="app-scroll-area">
            {children}
          </main>
          <BottomNav />
          <OfflineNotification />
          <SWRegistration />
        </div>
      </DictionaryProvider>
    </div>
  );
}
