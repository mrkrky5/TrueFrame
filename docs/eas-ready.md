# EAS Build — hazırlık kontrol listesi (v2.0.0)

Build **19** · sürüm **2.0.1** · bundle `com.trueframe.app`

Release notes: [`release-notes-size-cleanup.md`](./release-notes-size-cleanup.md)

## Kod tarafı (tamamlandı)

- [x] tf26 şablon paragrafları temizlendi (`npm run content:fix-tf26`)
- [x] Universal Links: `associatedDomains` + `trueframe://` + `DeepLinkBootstrap`
- [x] UMP + ATT: `AdsConsent.gatherConsent` + `expo-tracking-transparency`
- [x] Ayarlar → Reklam tercihlerini yönet
- [x] Erişilebilirlik: rotalar, reflection, günlük kart
- [x] Legacy kod / scratch temizliği

## Senin yapman gerekenler (build öncesi)

### 1. Universal Links (Apple web)

`legal-site/public/.well-known/apple-app-site-association` dosyasında **`TEAMID`** yerine Apple Developer Team ID yaz:

```
ABCDE12345.com.trueframe.app
```

Sonra legal-site’i deploy et. Test:

```
https://trueframe.app/.well-known/apple-app-site-association
```

### 2. AdMob UMP mesajları

[AdMob](https://admob.google.com) → **Privacy & messaging** → GDPR / US state mesajlarını yapılandır. UMP formu olmadan `gatherConsent` sessizce geçer.

### 3. App Store Connect metinleri

`docs/app-store-metinleri.md` — EN açıklama ve anahtar kelimeler güncel. Connect’e kopyala.

### 4. EAS build komutu

```powershell
cd mobile
eas login
eas build --platform ios --profile production
```

İlk seferde Apple sertifika soruları: **yes** (Apple hesabı), profile **reuse** mümkünse reuse.

### 5. TestFlight

Build bitince:

```powershell
eas submit --platform ios --latest
```

veya Connect → TestFlight → build seç.

### 6. Regression

`docs/testflight-regression.md` + yeni özellikler:

- Günlük hedef (Ayarlar + Ana sayfa)
- Rota tamamlama sheet
- Deep link: Safari’de `https://trueframe.app/tr/card/...` (AASA deploy sonrası)
- Reklam izin akışı (temiz kurulumda)

---

**Build 18:** EAS production IPA **22.89 MB** (build 17: 23.94 MB). Yerel değişiklikler commit edilmeden yüklendi — release öncesi commit + yeni build önerilir.

**Not:** Submit henüz yapılmadıysa: `cd mobile` → `eas submit --platform ios --latest`
