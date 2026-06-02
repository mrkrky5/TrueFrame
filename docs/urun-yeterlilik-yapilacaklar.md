# Ürün Yeterliliği — İçerik, Uygulama Hissi ve Yapılacaklar

> **Strateji notu (Mayıs 2026):** Mimari olarak web + mobil dual-surface tasarlandı. İlk çıkış **yalnızca mobil uygulama** olacak. Bu dosya “içerik ve ürün olarak yeterli mi?” sorusuna odaklanır; iOS teknik engeller için bkz. `ios-release-yapilacaklar.md`.

**Son güncelleme:** Mayıs 2026

---

## Kısa cevap: Bu bir uygulamadır ve içerik olarak yeterlidir mi?

### Genel değerlendirme: **EVET — ürün ve içerik tarafında yeterli**

App Store reddi riski burada “içerik az” değil, **paketleme biçimi** (canlı WebView) ve **yayın öncesi polish** (beta etiketi, eksik native davranışlar) kaynaklıdır. Ürünün kendisi ince bir blog veya tek sayfalık sarmalayıcı değil; gerçek bir okuma/keşif uygulaması.

---

## İçerik zenginliği

| Metrik | Durum |
|--------|--------|
| Türkçe kartlar | **~390** — ana katalog |
| İngilizce kartlar | **~366** (TR ile sayı farkı bilinçli; locale’e özel kartlar ürün çeşitliliği sağlar) |
| Öğrenme rotaları | **10** (TR ve EN) |
| Medya dosyaları (dossier) | Çoklu kartlı derin dosyalar mevcut |
| Flagship / derin okuma | Var — adım adım guided journey |
| Kaynakça | Kartlarda dış kaynak linkleri |
| Doğruluk durumu | Tüm kartlar `verified` — taslak/inceleme kullanıcıya görünmüyor |

**Sonuç:** İçerik hacmi ve derinliği, eğitim/keşif kategorisinde App Store'a çıkabilecek seviyede. “Sadece birkaç makale” algısı yaratmaz.

---

## “Gerçek uygulama” hissi — neredeyiz?

### Güçlü taraflar (yeterlilik kanıtları)

| Alan | Değerlendirme |
|------|---------------|
| **İlk 30 saniye değer önerisi** | Onboarding + Daily Reality Check — net |
| **Navigasyon** | 4 sekmeli bottom nav: Ana Sayfa, Keşfet, Rotalar, Kitaplık |
| **Keşif** | Arama, filtreler, etiketler, trending aramalar, medya dosyası kartları |
| **Okuma deneyimi** | Flagship guided reader, spoiler koruması, ilerleme kaydı |
| **Kişiselleştirme** | Kaydet, son görülen, tamamlanan, okumaya devam et |
| **Öğrenme katmanı** | Doğruluk tahmini, yansıma etiketleri (“Bunu öğrendim” vb.) |
| **Boş durumlar** | Kütüphane, arama sonucu yok — iyi tasarlanmış |
| **404** | Markaya uygun, yönlendirici |
| **Gizlilik modeli** | Hesap yok, veri cihazda — sade ve anlaşılır |
| **TR/EN lokalizasyon** | UI sözlük sistemiyle büyük ölçüde tamamlanmış |
| **Görsel dil** | Tutarlı arşiv/kağıt estetiği, premium kart tasarımı |

### Zayıf / eksik taraflar (ürün polish — engel değil, iyileştirme)

| Alan | Durum |
|------|--------|
| **“Beta” etiketi** | Kullanım şartlarında görünür — production hissi bozar |
| **Bazı hardcoded metinler** | Ana sayfa başlığı, Loading fallback sözlük dışında |
| **Yükleme / hata durumları** | Minimal — `loading.tsx` / `error.tsx` yok |
| **Offline okuma** | Banner var ama içerik yüklenmez — uygulama hissi zayıflar |
| **iPad / büyük ekran** | App modda dar mobil kolon — telefon için OK, tablet için dar |
| **Karanlık mod** | Yok — tek tema tutarlı ama OS dark mode desteklemiyor |
| **Durum rozeti (draft/review)** | Kod var, kullanıcıya gösterilmiyor — sorun değil |

---

## App Store “4.2 — Minimum Functionality” açısından

Apple bazen saf WebView sarmalayıcılarını reddeder. Bu uygulama o kategoride **değil**, çünkü:

- Zengin, uygulama-içi navigasyon ve durum (kütüphane, ilerleme, rotalar)
- Etkileşimli okuma (spoiler gate, adım adım journey, tahmin/reflection)
- Yerel depolama ile kişisel deneyim
- Çok dilli, editoryal içerik kütüphanesi

**Risk:** Paketleme hosted WebView ise Apple “web sitesinin kopyası” diyebilir — bu **içerik yetersizliği değil**, dağıtım stratejisi meselesi.

**Ürün tarafı savunma cümlesi (App Review için):**
> True Frame, popüler medya eserleri ile tarihi gerçekler arasındaki bağlantıları keşfetmek için tasarlanmış bir eğitim uygulamasıdır. 390+ derinlemesine dosya, okuma yolculukları, kişisel kütüphane ve spoiler koruması sunar.

---

## Yeterlilik skoru kartı

| Boyut | Puan (1–5) | Not |
|-------|------------|-----|
| İçerik hacmi | **5/5** | 190 TR kart, rotalar, dossier'lar |
| İçerik kalitesi (yapı) | **4/5** | Flagship derin okuma, kaynaklar; akademik referans değil uyarısı var |
| Uygulama akışları | **4/5** | Tam döngü: keşfet → oku → kaydet → devam et |
| UX polish | **3.5/5** | İyi boş durumlar; beta etiketi ve loading/hata zayıf |
| “Prototype değil” hissi | **4/5** | Günlük içerik, rotalar, kütüphane — gerçek ürün |
| App Store ürün yeterliliği | **4/5** | İçerik/ürün OK; teknik iOS paketleme eksik |

**Toplam ürün kararı:** App Store'a **içerik ve uygulama deneyimi olarak çıkmaya hazır**. Teknik iOS altyapısı ve birkaç polish maddesi tamamlanmalı.

---

## Yapılacaklar — ürün / içerik / deneyim odaklı

Bunlar iOS mühendisliğinden ayrı, “uygulama olarak daha ikna edici ve polished” olmak için.

### P0 — Yayın öncesi ürün polish

- [x] **Beta etiketini kaldır** — kullanım şartları banner + disclaimer (`terms/page.tsx`)
- [x] **App Store anlatısını netleştir** — bkz. `docs/app-store-metinleri.md`
- [x] **Onboarding metnini son kez gözden geçir** — TR/EN (`lib/dictionaries/*.json`)
- [x] **Hardcoded UI metinlerini sözlüğe taşı** — `HomeClient.tsx`, `ExploreClient.tsx`
- [x] **Gizlilik metnini mobil-only çıkışa göre güncelle** — cihaz odaklı metin, sözlükte

### P1 — Deneyimi güçlendir (App Review + kullanıcı)

- [ ] **İlk oturum akışını test et** — onboarding → daily card → bir flagship okuma → kütüphaneye kaydet (30 saniyede değer net mi?) — *elle QA*
- [ ] **Explore boş arama / filtre reset** — mevcut, QA ile doğrula
- [x] **Paylaşım deneyimi** — `navigator.share` + kopyalama fallback mevcut; hata logları temizlendi
- [x] **Hata sınırları ekle** — `app/[lang]/error.tsx`, `loading.tsx`
- [x] **İsim tutarlılığı** — marka **True Frame** (manifest, sözlük, mağaza metinleri)
- [x] **Destek / geri bildirim kanalı** — TR/EN için `contact@trueframe.app`
- [x] **App Review demo notu** — bkz. `docs/app-review-demo-yolu.md`

### P2 — v1.1 ve sonrası (ürün büyümesi)

- [ ] İngilizce App Store listesi + Capacitor locale girişi
- [ ] Offline okuma (en azından son okunan / kaydedilen kartlar cache)
- [ ] iPad düzeni (app modda geniş kolon)
- [ ] Karanlık mod
- [ ] Push: “Günün Gerçeklik Kontrolü” (opsiyonel, v2)
- [ ] Kullanıcı istatistikleri özeti (“12 dosya okudun” gibi) — engagement artırır
- [x] Eksik medya talebi — Keşfet altı `MissingMediaRequest` + mailto

---

## Mobil-only çıkış — ürün açısından ne değişir?

| Konu | Etki |
|------|------|
| Dual-shell mimari | Kod kalabilir; app build `surface=app` ile çalışır |
| Desktop grid / nav | App modda zaten gizli — kullanıcı görmez |
| Web SEO / sitemap | App release'i etkilemez |
| İçerik yatırımı | Web için ayrı QA zorunlu değil; app akışlarına odaklan |
| App Store positioning | “Web sitesi + app” değil, **“tarih keşif uygulaması”** olarak konumlandır |
| Offline beklentisi | Mobil kullanıcı offline bekler — hosted modda bu ürün zayıf noktası |

---

## Özet cümleler

**İçerik:** Yeterli ve zengin. 190 kart, rotalar, dossier'lar, derin okuma — ince bir sarmalayıcı değil.

**Uygulama hissi:** Yeterli. Navigasyon, kütüphane, ilerleme, onboarding, keşif — gerçek bir ürün döngüsü var.

**Eksik olan:** iOS kabuğu, yayın polish'i (beta kaldırma, native linkler, varlıklar) ve dağıtım stratejisi (hosted vs gömülü).

**Mobil-only kararı:** Ürün tarafında sorun yaratmaz; hatta odaklanmayı kolaylaştırır. Tek dikkat: offline ve WebView algısı için teknik tarafta (diğer dosya) karar verilmeli.

---

## İki dosya arasındaki ayrım

| | `ios-release-yapilacaklar.md` | `urun-yeterlilik-yapilacaklar.md` |
|--|-------------------------------|-------------------------------------|
| **Odak** | Xcode, Capacitor, App Store teknik | İçerik, UX, mağaza anlatısı |
| **Soru** | “iOS'a nasıl çıkarız?” | “Bu gerçekten yeterli bir uygulama mı?” |
| **Karar** | HAZIR DEĞİL (teknik) | EVET, yeterli (ürün) |
