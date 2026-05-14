import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const crimson = Crimson_Pro({ subsets: ["latin"], variable: "--font-serif" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${crimson.variable}`} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <script
          id="onboarding-check"
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
      </head>
      <body className="font-sans bg-bg-main text-neutral-950 antialiased selection:bg-brand-secondary/20 selection:text-brand-secondary">
        {children}
      </body>
    </html>
  )
}
