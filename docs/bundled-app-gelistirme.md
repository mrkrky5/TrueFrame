# Bundled App Geliştirme

Uygulama artık **uzak URL yüklemez**. Capacitor, `out/` içindeki static export’u cihaza gömer.

## Komutlar

```bash
# 1) Static export (542 sayfa, ~1–2 dk)
npm run build:app

# 2) iOS native projeye kopyala
npx cap sync ios
# veya tek satır:
npm run cap:sync:app

# 3) Mac’te Xcode
npx cap open ios
```

Bu proje artık **mobil uygulama only**; ayrı web build yok.

## Mimari

| Build | Env | Çıktı |
|-------|-----|--------|
| `build:app` / `build` | `NEXT_PUBLIC_APP_TARGET=native` | `out/` + `output: export` |

Windows geliştirme: `docs/windows-gelistirme.md`

Native build sırasında geçici olarak devre dışı: `middleware.ts`, `app/sitemap.ts`, `app/robots.ts` (static export uyumsuzluğu).

## Davranış farkları

- **App shell her zaman aktif** — `?surface=app` gerekmez
- **Desktop üst nav yok** — kaldırıldı
- **Service worker yok** — native’de zaten kapalı
- **İçerik gömülü** — kart metinleri HTML/JS içinde; görseller Wikimedia’dan (ağ gerekir)
- **Sekmeler arası geçiş** — yerel dosyalar, sunucu round-trip yok

## İçerik güncelleme

Yeni kart ekledikten sonra: `npm run build:app` → `cap sync` → yeni store build.

İleride: OTA content pack (vizyon belgesi Faz D).

## Sorun giderme

| Sorun | Çözüm |
|-------|--------|
| `out/` yok | `npm run build:app` hata loguna bak |
| Beyaz ekran | Xcode’da `out/tr/index.html` yolunu kontrol et; kök `index.html` redirect |
| RSC 404 / boş sayfa (preview) | `serve-out.mjs` kullan (`npm run preview:app`); build sonrası `flatten-rsc.mjs` çalışır |
| Onboarding sonrası boş | `MainShell` chrome dışında — güncel build al |
