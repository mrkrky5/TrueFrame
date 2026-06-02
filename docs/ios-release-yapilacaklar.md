# iOS Yayın Hazırlığı — Denetim Özeti ve Yapılacaklar

> **Strateji notu (Mayıs 2026):** Uygulama mimari olarak hem web sitesi hem mobil uygulama (`?surface=app`) için tasarlandı. İlk App Store çıkışı **yalnızca mobil uygulama** olarak planlanıyor; web sitesi ayrı bir kanal olarak kalabilir ama release önceliği iOS.

**Uygulama:** True Frame  
**Genel karar:** ALMOST READY (iOS projesi eklendi; Mac/Xcode imzalama + ikon/splash + TestFlight kaldı)  
**Son güncelleme:** Mayıs 2026

---

## Önceki denetim özeti

### En büyük 5 engel

1. **iOS projesi yok** — `ios/` klasörü, Xcode projesi, `@capacitor/ios` eklenmemiş
2. **Canlı siteye bağımlı WebView** — `capacitor.config.ts` production URL yükler; internet olmadan uygulama pratikte çalışmaz
3. **Capacitor girişi her zaman Türkçe** — `https://trueframe.app/tr?surface=app` sabit; cihaz dili dikkate alınmıyor
4. **Kullanım şartlarında “beta” ifadesi** — mağaza sürümüyle çelişiyor
5. **iOS marka varlıkları eksik** — App Icon, splash, `public/` altında referans verilen ikonlar repo'da yok

### P0 — TestFlight / App Store öncesi şart

- [x] iOS Capacitor projesi oluştur (`@capacitor/ios`, `npx cap add ios`) — `ios/` klasörü eklendi
- [ ] Bundle ID: `com.trueframe.app`, imzalama ve Xcode yapılandırması (**Mac gerekli**)
- [ ] App Store ikonu (1024×1024) + iOS asset catalog + launch screen — bkz. `docs/ios-icon-ve-splash.md`
- [x] Hosted URL vs gömülü build kararı: **v1 hosted** (`capacitor.config.ts` yorumu + `docs/ios-native-hissi-onerileri.md`)
- [x] App Store Connect gizlilik URL: `https://trueframe.app/tr/privacy`
- [x] Destek URL: `https://trueframe.app/tr/support` (`app/[lang]/support/page.tsx`)
- [x] Beta etiketi kaldırıldı (`terms/page.tsx`)
- [x] Dış kaynak linkleri Safari'de — `lib/native/open-external-url.ts` + `ExternalSourceLink`
- [x] Cihaz dili — `NativeLocaleBootstrap` (ilk açılış EN yönlendirmesi)
- [x] Destek e-postası — `iletisim@trueframe.app`

### P1 — Yayın öncesi yapılmalı

- [x] App Review notu — `docs/ios-app-review-notu.md`
- [x] `NativeBridge.tsx` — iOS status bar
- [x] `viewport` — zoom erişilebilirliği açıldı (`userScalable: true`)
- [x] Hardcoded string / yasal metin / manifest / onboarding / sürüm `1.0.0`
- [ ] Mobil-only + TestFlight QA — `docs/app-review-demo-yolu.md` checklist

### P2 — Sonra iyileştirilebilir

- [ ] Karanlık mod
- [ ] iCloud / cihazlar arası senkron
- [ ] iPad geniş ekran düzeni (`ResponsivePageContainer` app modda `max-w-lg` zorluyor)
- [ ] Service worker stratejisi — offline okuma yatırımı veya native shell'den kaldırma
- [ ] Haptic feedback (kaydet, tamamla)

---

## TestFlight kontrol listesi

- [ ] İlk kurulum → onboarding → Daily Reality Check → bir flagship kart oku
- [ ] Ağ kesilince offline banner + boş/beyaz ekran yok
- [ ] Kaynak linki Safari'de açılıyor (WebView'da takılmıyor)
- [ ] iOS paylaşım sheet'i çalışıyor
- [ ] Kütüphaneye kaydet → uygulamayı sil → veri kaybı gizlilik metniyle uyumlu mu
- [ ] TR ↔ EN dil değiştirme
- [ ] Explore arama + klavye (SE ve Pro Max)
- [ ] Kart okuyucuda geri tuşu + iOS edge swipe-back
- [ ] Okuma sırasında bottom nav gizleniyor, çıkınca geri geliyor
- [ ] Notch / Dynamic Island / home indicator güvenli alanları
- [ ] Deep link: `/tr/card/[id]`, `/tr/media/[slug]`
- [ ] Gizlilik + şartlar sayfalarına Library'den erişim
- [ ] Soğuk açılış, yavaş 4G yükleme süresi

---

## Muhtemelen değişecek dosyalar

| Öncelik | Dosya / alan |
|---------|----------------|
| P0 | **Yeni:** `ios/` |
| P0 | `capacitor.config.ts` |
| P0 | `package.json` |
| P0 | `app/[lang]/terms/page.tsx` |
| P0 | `lib/config.ts` |
| P0 | **Yeni:** iOS App Icon + splash |
| P0 | **Yeni / düzelt:** `public/favicon.png`, `apple-touch-icon.png`, `/icons/*` |
| P0 | `components/reading/ContentBlock.tsx`, `StandardLiteReader.tsx` |
| P1 | `components/utils/NativeBridge.tsx` |
| P1 | `components/pages/HomeClient.tsx` |
| P1 | `components/pages/ExploreClient.tsx` |
| P1 | `app/[lang]/privacy/page.tsx` |
| P1 | `public/manifest.json` |
| P1 | `next.config.ts` (gömülü build seçilirse) |

---

## App Store varlık hazırlığı

### Ekran görüntüleri (önerilen 5–8 kare)

1. Onboarding / değer önerisi
2. Ana sayfa — Daily Reality Check
3. Keşfet — arama + dosya grid
4. Medya dosyası sayfası
5. Flagship okuyucu + spoiler koruması
6. Öğrenme rotası / ilerleme
7. Kütüphane (kaydedilen + tamamlanan)
8. Kaynaklar / gerçek vs kurgu anı

### Önerilen mağaza metinleri

- **Alt başlık (TR):** Medyanın Ardındaki Tarih
- **Alt başlık (EN):** History Behind the Media
- **Birincil kategori:** Eğitim
- **İkincil kategori:** Eğlence veya Referans
- **Anahtar kelimeler:** tarih, medya, oyun, film, dizi, gerçekler, eğitim, belgesel

### Gerekli web sayfaları

| Sayfa | URL |
|-------|-----|
| Gizlilik Politikası | `https://trueframe.app/tr/privacy` |
| Kullanım Şartları | `https://trueframe.app/tr/terms` |
| Destek | `https://trueframe.app/tr/support` |

---

## Önerilen ilk sürüm kapsamı (iOS)

1. iOS Capacitor kabuğu + production imzalama
2. **Türkçe odaklı** ilk App Store çıkışı
3. P0 maddelerinin tamamı
4. Ücretsiz, hesapsız, aboneliksiz
5. İngilizce mağaza listesi v1.1'e bırakılabilir

**Tahmini süre:** TestFlight + App Store için birkaç haftalık release mühendisliği ve QA.

---

## Mobil-only çıkış notu

Kod tabanı `SurfaceProvider` ile web/app dual-shell mimarisini koruyor. Sadece uygulama çıkarılacaksa:

- App Store build'i her zaman `?surface=app` modunda çalışmalı (mevcut Capacitor config bunu yapıyor)
- Desktop navigasyon (`DesktopTopNav`) app modda zaten devre dışı — sorun yok
- Web sitesi ayrı deploy edilmeye devam edebilir; iOS release checklist'i web regresyonunu kapsamak zorunda değil
- Hosted URL stratejisinde web ve app aynı backend'i paylaşır — web'deki bir kırılma app'i de etkiler; bu riski kabul et veya gömülü build'e geç
