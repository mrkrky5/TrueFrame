# App Store yayın — Build 16+ (production reklam)

TestFlight QA tamamlandıktan sonra sıra.

## Windows (önce burada)

```powershell
cd C:\Users\Emre\Desktop\Tarih
npm run mobile:check
npm run pack:mac:project
```

Zip: `dist\trueframe-mac-project-YYYY-MM-DD.zip` → Mac’e aktar.

**Bu turdaki kod değişikliği:**
- `mobile/constants/ads.ts` → `USE_TEST_ADS = false`
- `mobile/assets/images/icon.png` (+ `splash-icon.png`, `favicon.png`) — `icon1.png` kaynağından üretildi

Mac’te sadece reklam değilse şu 3 dosyayı kopyala: `mobile/assets/images/icon.png`, `splash-icon.png`, `favicon.png`

---

## Mac — dosya güncelleme

Eski klasör: `~/Desktop/TrueFrame-product-elevation-experiments`

**A)** Zip ile (önerilen): yedek al → zip’i proje köküne aç (Replace)  
**B)** Sadece reklam fix: `mobile/constants/ads.ts` dosyasını Windows’tan kopyala → `.../mobile/constants/ads.ts`

```bash
cd ~/Desktop/TrueFrame-product-elevation-experiments
npm run mobile:sync
git add -A && git commit -m "release: production AdMob units"
```

---

## Mac — Build 16

```bash
cd ~/Desktop/TrueFrame-product-elevation-experiments/mobile
npx eas build -p ios --profile production
```

Sorular: Apple **yes** · sertifika/profile **reuse** · yeni profile gerekirse **yes** · şifreleme **Y** · git **no** (veya commit’li repo).

Build numarası otomatik **16** olmalı (remote 15’ten sonra).

---

## Mac — TestFlight + reklam doğrulama

```bash
npx eas submit -p ios --latest
```

Telefonda build **16**:
- Keşfet → kartlar arası alan → **gerçek reklam** (Test Ad yazısı olmamalı; bazen düşük fill boş kalabilir).
- Okuma sonrası slot (varsa) çökme yok.

---

## App Store Connect (web, Mac şart değil)

**Adım adım rehber:** [`app-store-connect-listing.md`](./app-store-connect-listing.md)

Özet: build **16** → screenshot → metadata → App Privacy → Submit for Review.

---

## Hızlı kontrol

| # | Madde |
|---|--------|
| 1 | Connect’te build **≥16**, production ads |
| 2 | Gizlilikte reklam/AdMob |
| 3 | Screenshot + ikon yüklü |
| 4 | Export compliance tamam |

---

*Son kod: `USE_TEST_ADS = false` — Haziran 2026*
