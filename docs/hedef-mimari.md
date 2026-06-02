# Hedef Mimari — True Frame

> Maliyet ve süre hesabı olmadan, **bu ürün için doğru** altyapı kararı.  
> Son güncelleme: Mayıs 2026

---

## Ürün profili

| Özellik | Gerçek |
|---------|--------|
| Kanal | **Yalnızca mobil uygulama** (web sitesi yok) |
| İçerik | ~190 TR kart, JSON gömülü (~1 MB), okuma ağırlıklı |
| Etkileşim | Spoiler gate, rota, ilerleme, kitaplık |
| Platform | **Yalnızca iOS** (Expo + EAS / TestFlight) |
| Geliştirme | Windows makine, Mac yok (şimdilik) |
| Güncelleme | Store release + ileride OTA içerik paketi |

---

## Teşhis: Next.js + Capacitor neden yanlış?

Next.js **web sitesi** framework’üdür: SSR, RSC, SEO, middleware, 542 statik sayfa.

Bu projede ihtiyaç duyulan şey **tek kullanıcılı, offline-first, client-side uygulama**:

| Next + Capacitor (mevcut) | Sorun |
|---------------------------|--------|
| App Router + static export | RSC dosya yolları, `flatten-rsc.mjs`, özel sunucu |
| 542 önceden üretilmiş HTML | Keşfet araması yavaş; her kart ayrı dosya |
| `middleware`, `sitemap`, build script | Web kalıntıları |
| WKWebView | Tarayıcı motoru; scroll, geri jesti, klavye sınırlı |
| Windows → iOS | `cap open ios` Mac gerektirir |

**React doğru. Next.js ve Capacitor WebView kabuğu bu ürün için yanlış katman.**

---

## Hedef yığın: Expo (React Native)

```
┌─────────────────────────────────────────────┐
│  mobile/          Expo + Expo Router        │
│  ─ Tab: Ana Sayfa / Keşfet / Rotalar / Kitaplık
│  ─ Stack: kart detay, rota detay, medya     │
│  ─ Native navigasyon, geri swipe, haptic    │
├─────────────────────────────────────────────┤
│  shared/          Ortak mantık (framework yok)
│  ─ content, daily, i18n, dictionary         │
├─────────────────────────────────────────────┤
│  data/ + types/   Tek içerik kaynağı        │
│  lib/dictionaries UI metinleri              │
└─────────────────────────────────────────────┘
```

### Neden Expo?

| Kriter | Expo |
|--------|------|
| Gerçek native UI | React Native — WebView değil |
| Windows’tan iOS test | **Expo Go** (iPhone’da QR) |
| Mac olmadan store build | **EAS Build** (bulut) |
| OTA içerik / JS güncelleme | `expo-updates` (ileride) |
| Navigasyon | Expo Router — dosya tabanlı, stack + tabs |
| React bilgisi | Korunur; DOM → RN bileşenleri |
| App Store algısı | Standart native uygulama modeli |

### Neden SwiftUI değil?

iOS için en saf seçenek SwiftUI — ancak içerik pipeline’ı, 190 kartlı okuyucu ve TR/EN i18n zaten TypeScript/React’te. Expo aynı hedefe **tek codebase** ile gider; SwiftUI tam yeniden yazım demek.

---

## Geliştirme biçimi

### Günlük döngü (Windows)

```bash
cd mobile
npm start
```

1. iPhone’da **Expo Go** aç → QR okut  
2. Değişiklik anında yansır (Fast Refresh)  
3. Web preview: `npm run web` — sadece layout kontrolü, asıl hedef cihaz

### Store / TestFlight (Mac gerekmez)

```bash
cd mobile
npx eas build --platform ios
npx eas submit --platform ios
```

İlk kurulum: `eas login` + Apple Developer hesabı.

### İçerik güncelleme

1. `data/cards.tr.json` düzenle  
2. `shared/content.ts` aynı dosyayı okur — ek deploy yok  
3. Yeni build veya (Faz 2) OTA content manifest

### Depolama

| Veri | Teknoloji |
|------|-----------|
| Okuma ilerlemesi, kitaplık | `react-native-mmkv` (ileride) / şimdilik AsyncStorage |
| İçerik | Build-time JSON import |
| Dil tercihi | MMKV + cihaz dili |

---

## Migrasyon planı

| Faz | İş | Durum |
|-----|-----|--------|
| **0** | Expo iskelet + shared + gerçek ana sayfa | ✅ |
| **1** | Keşfet (bellekte arama/filtre) | ✅ |
| **2** | Kart okuyucu (lite + spoiler + kaynak) | ✅ |
| **3** | Rotalar + kitaplık + onboarding | ✅ |
| **4** | EAS iOS build, App Store metadata | Bekliyor |
| **5** | Eski `app/` Next.js kodunu arşivle / sil | Bekliyor |

Eski Next + Capacitor kodu **Faz 5**’e kadar referans olarak kalabilir; yeni geliştirme yalnızca `mobile/` altında.

---

## Bilinçli olarak yapılmayanlar

- **Web sitesi / SEO** — ürün kararı: yok  
- **Capacitor / WKWebView** — kalıcı çözüm değil  
- **Next.js static export hack’leri** — `flatten-rsc`, `serve-out` geçici  
- **Hosted URL (`server.url`)** — asla geri dönülmez  

---

## Komut özeti

| Amaç | Komut |
|------|--------|
| Mobil geliştirme | `npm run mobile` |
| iOS bulut build | `cd mobile && eas build -p ios` |
| Eski web preview (legacy) | `npm run preview:app` |
