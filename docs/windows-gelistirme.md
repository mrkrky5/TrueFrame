# Windows'ta geliştirme (Expo)

> **Bu proje Flutter değil — Expo (React Native).**  
> `flutter run -d windows` **çalışmaz.**

Detaylı mimari: `docs/hedef-mimari.md`

## Uygulama gibi test (Windows)

> **Önemli:** `mobile:windows` gerçek uygulama değil — React Native Web ile tarayıcıda önizleme.  
> Layout kontrolü için yeterli; native his (haptic, scroll, performans) için **Expo Go** veya **gerçek iPhone / iOS simülatör (Mac)** kullan.

### Seçenek A — Web preview (telefon genişliği ~430px)

```powershell
npm run mobile:windows
```

Tarayıcıda `http://localhost:8081` açılır. Sayfa ortada dar sütun + gri arka plan olmalı.

Hâlâ tam ekransa: tarayıcıyı **Ctrl+Shift+R** ile yenile veya pencereyi ~450px genişliğe daralt.

Onboarding sıfırlama:

```powershell
$env:EXPO_PUBLIC_RESET_FIRST_RUN="true"; npm run mobile:windows
```

### Seçenek B — Gerçek iPhone (en doğru)

```powershell
npm run mobile
```

Expo Go ile QR okut.

## iOS TestFlight (Mac gerekmez)

```powershell
cd mobile
npx eas login
npx eas build --platform ios --profile preview
```

## Flutter vs Expo

| Flutter komutu | Bu projede karşılığı |
|----------------|----------------------|
| `flutter run -d windows` | `npm run mobile:windows` (web preview) |
| `--dart-define=RESET_FIRST_RUN=true` | `$env:EXPO_PUBLIC_RESET_FIRST_RUN="true"` |
| Native Windows .exe | **Desteklenmiyor** — hedef yalnızca iOS |

Native Windows masaüstü uygulaması hedef değil; Windows’ta geliştirme + web preview + iOS TestFlight.

## Legacy Next.js (kaldırılacak)

```powershell
npm run preview:app
npm run dev
```
