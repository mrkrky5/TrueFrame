import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Crimson_Pro } from "next/font/google";
import "../globals.css";
import BottomNav from "@/components/layout/BottomNav";
import Onboarding from "@/components/ui/Onboarding";
import SWRegistration from "@/components/utils/SWRegistration";
import OfflineNotification from "@/components/ui/OfflineNotification";
import { i18n, type Locale } from "@/lib/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import { DictionaryProvider } from "@/components/utils/DictionaryProvider";
import { SITE_CONFIG } from "@/lib/config";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const crimson = Crimson_Pro({ subsets: ["latin"], variable: "--font-serif" });

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
      statusBarStyle: "black-translucent",
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

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return (
    <html lang={lang} className={`${inter.variable} ${crimson.variable}`} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans bg-bg-main text-neutral-950 antialiased selection:bg-brand-secondary/20 selection:text-brand-secondary">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (!localStorage.getItem('onboarding-completed')) {
                  document.documentElement.classList.add('force-onboarding');
                }
              } catch (e) {}
            `,
          }}
        />
        <DictionaryProvider dictionary={dictionary}>
          {/* Global Status Bar Safe-Area Mask */}
          <div
            className="fixed top-0 left-0 right-0 bg-bg-main z-90 pointer-events-none"
            style={{ height: 'env(safe-area-inset-top, 20px)' }}
          />
          <Onboarding />
          <main className="min-h-screen animate-in fade-in duration-700">
            {children}
          </main>
          <BottomNav />
          <OfflineNotification />
          <SWRegistration />
        </DictionaryProvider>
      </body>
    </html>
  );
}

