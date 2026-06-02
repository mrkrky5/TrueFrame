import { ScrollViewStyleReset } from "expo-router/html";
import type { ReactNode } from "react";

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* Masaüstünde tam ekran yerine mobil genişlik hedefle */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: previewCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const previewCss = `
html {
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
  overflow: hidden;
  background-color: #e8e6e1 !important;
  display: flex;
  justify-content: center;
  -webkit-text-size-adjust: 100%;
  touch-action: manipulation;
}

* {
  -webkit-tap-highlight-color: transparent;
}

button,
[role="button"],
a {
  -webkit-user-select: none;
  user-select: none;
}

/* Web önizlemede masaüstü scrollbar'ı gizle — native his */
*::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}
* {
  scrollbar-width: none;
}

#root {
  width: 100%;
  max-width: 430px;
  min-height: 100%;
  height: 100%;
  background-color: #EDE9E1;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06), 0 24px 80px rgba(0, 0, 0, 0.12);
}

/* Tab bar ve header tam genişlik taşmasını kes */
#root > div,
#root > div > div {
  width: 100% !important;
  max-width: 100% !important;
  flex: 1;
  display: flex;
  flex-direction: column;
}

@media (max-width: 430px) {
  body {
    background-color: #EDE9E1 !important;
  }
  #root {
    box-shadow: none;
    max-width: 100%;
  }
}
`;
