# iOS App Icon ve Splash — Üretim Rehberi

App Store’a çıkmadan önce **zorunlu** görsel varlıklar.

## App Icon

| Özellik | Değer |
|---------|--------|
| App Store | 1024×1024 px, PNG, şeffaflık yok |
| Stil | Arşiv kağıdı `#FAF9F6` veya koyu `#1a1a1a` zemin; altın vurgu `#c5a059`; serif tipografi |
| İçerik | **True Frame** logosu veya mühür — küçük boyutta okunur olmalı |

**Xcode:** `ios/App/App/Assets.xcassets/AppIcon.appiconset/` (Capacitor add ios sonrası)

Araçlar: Figma, [appicon.co](https://www.appicon.co), Icon Composer (macOS 26+).

## Launch Screen / Splash

| Özellik | Değer |
|---------|--------|
| Arka plan | `#FAF9F6` (marka) |
| İçerik | Merkezde logo veya sadece marka adı — **spinner kullanmayın** |
| Capacitor | `@capacitor/splash-screen` + `capacitor.config` `plugins.SplashScreen` (isteğe bağlı) |

## Web ikonları (PWA / metadata)

Repo’da referans var, dosyalar eksik olabilir:

- `public/favicon.png`
- `public/apple-touch-icon.png`
- `public/icons/icon-192x192.png`
- `public/icons/icon-512x512.png`

Hepsini aynı 1024 kaynaktan export edin.

## Kontrol listesi

- [ ] 1024 master PNG hazır
- [ ] Xcode AppIcon set dolu
- [ ] Launch storyboard / splash plugin test edildi (beyaz flaş yok)
- [ ] TestFlight’ta ana ekran ikonu doğru görünüyor
