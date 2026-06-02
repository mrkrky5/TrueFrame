# Ürün ve Mimari Vizyon — “Gerçek iOS Uygulaması” Olmak

> Bu belge **App Store, TestFlight, ekran görüntüsü** değil; ürünün nasıl hissettirmesi ve hangi köklü değişikliklerin gerektiği üzerinedir.  
> Hedef: Geliştirilebilir, güzelleştirilebilir, **cihazda çalışan** bir uygulama — uzaktan açılan web sitesi değil.

**Son güncelleme:** Mayıs 2026

---

## 1. Teşhis: Şu an ne var?

### Gerçek mimari (önemli)

```
[iOS ikon] → Capacitor WKWebView → https://trueframe.app/tr?surface=app
                                      ↓
                              Next.js sunucusu (her sayfa)
                                      ↓
                              HTML + JS + veri isteği
```

Yani kullanıcı açtığı şey teknik olarak:

- Telefonda çalışan bir **tarayıcı sekmesi** (adres çubuğu yok ama model aynı)
- Her sekme değişimi (Ana Sayfa → Keşfet → Kart) **ağ üzerinden** sayfa yüklemesi
- İnternet yoksa → boş / offline banner, içerik yok
- `webDir: 'out'` ve `ios/` klasörü var ama `capacitor.config.ts` içindeki **`server.url` bunların tamamını eziyor** — uygulama paketindeki dosyalar kullanılmıyor

Bu, “UI polish” ile tam düzelmez. **Paketleme modeli** değişmeden “native app” hissi tavan yapar.

### Ürün tarafı (iyi olan)

| Alan | Durum |
|------|--------|
| İçerik derinliği | Güçlü — ~190 TR kart, flagship okuma, kaynaklar |
| Bilgi mimarisi | Ana sayfa / Keşfet / Rotalar / Kitaplık mantıklı |
| Etkileşim | Spoiler gate, tahmin, yansıma, ilerleme — gerçek uygulama özellikleri |
| Görsel dil | Tutarlı arşiv estetiği |

### Deneyim tarafı (web gibi hissettiren)

| Belirti | Neden |
|---------|--------|
| Açılış gecikmesi | Uzak sunucu + ilk JS/HTML |
| Sekmeler arası “yenileme” hissi | Sunucu-render + tam sayfa geçişleri |
| `?surface=app` | Uygulama modu URL parametresiyle — kırılgan |
| `isApp` / `isWebsite` her yerde | İki ürün bir kodda; app asla sadeleşmiyor |
| Desktop grid / nav kodu app’te de duruyor | Gereksiz karmaşıklık |
| İçerik güncellemesi = site deploy | App ile içerik ayrışmıyor |
| Görseller Wikimedia’dan | Her okuma ağa bağlı |

**Özet:** İçerik ve özellik seti uygulama; **dağıtım ve kabuk** hâlâ web sitesi.

---

## 2. “Normal bir iOS uygulaması” ne demek? (Üç katman)

### Katman A — Paket (en kritik)

Uygulama **IPA içinde** taşır:

- UI kodu (JS bundle veya native)
- Metin içeriği (JSON veya sqlite) — TR ~0,8 MB, EN ~0,5 MB; **cihaza sığar**
- İsteğe bağlı: kritik görseller cache

Açılış: **0,5–2 sn içinde** ilk ekran (splash + yerel shell), ağ olmadan bile keşif listesi / son okunan görülebilir.

### Katman B — Navigasyon

- Tab bar sabit (zaten var)
- Detay ekranları **stack** gibi: sağdan gelme / geri swipe (iOS varsayılanı + tutarlı header)
- Sayfa “reload” değil **ekran geçişi** — aynı shell, state korunur
- Derin linkler mümkün ama zorunlu değil

### Katman C — Veri ve güncelleme

- Okuma ilerlemesi, kitaplık → cihazda (zaten localStorage)
- İçerik kartları → **build’de gömülü** veya ilk açılışta bir kez indirilen “content pack”
- Yeni kartlar → uygulama güncellemesi **veya** arka planda content pack (OTA) — bilinçli ürün kararı

---

## 3. Mimari seçenekler (köklü)

### Seçenek 1 — Bundled Capacitor + Next static export ⭐ Önerilen

**Ne:** `server.url` kaldırılır. `next build` + `output: 'export'` → `out/` → Capacitor `webDir`. Tüm sayfalar build zamanında üretilir.

| Artı | Eksi |
|------|------|
| Mevcut React bileşenlerinin ~%90’ı kalır | `generateStaticParams` tüm kart/media/rota için |
| Tek repo, web + app aynı kaynak | `next/image` → `unoptimized` veya `<img>` |
| Offline: shell + HTML anında; kart metni yerel | İçerik güncellemesi = yeni build veya OTA katmanı |
| App Store 4.2 için çok daha güçlü | İlk static export migrasyonu 1–2 hafta iş |

**Web sitesi:** Aynı kod, farklı deploy (Vercel SSR) veya web de static (SEO için ayrı değerlendirme).

---

### Seçenek 2 — Tek sayfa uygulama (SPA) + gömülü JSON

**Ne:** Mobil için Vite/React (veya Next’i SPA modunda). Uygulama açılınca `cards.tr.json` bir kez yüklenir; routing tamamen client (`/card/:id`).

| Artı | Eksi |
|------|------|
| Keşfet araması **anında** (bellekte filtre) | Web SEO için ayrı Next sitesi (iki yüz) |
| En “app hissi” navigasyon | Orta büyüklükte refactor |
| Paket boyutu öngörülebilir | Paylaşılan component stratejisi gerekir |

**Ne zaman:** Keşfet/arama performansı ve offline okuma birincil öncelikse.

---

### Seçenek 3 — React Native / Expo

| Artı | Eksi |
|------|------|
| En native his (animasyon, liste, haptic) | En pahalı: UI baştan |
| App Store’a en tanıdık model | İçerik pipeline yeniden |

**Ne zaman:** 6+ ay horizon ve native ekip isteği varsa. Şu anki içerik yatırımı için **erken**.

---

### Seçenek 4 — Hosted URL’de kalmak

Sadece status bar, haptic, Safari linkleri ile **tavan ~%70 “app”**. Sizin hedefinizin altında; **önerilmez**.

---

## 4. Önerilen yön: “App = ayrı hedef”

```
┌─────────────────────────────────────────────────────────┐
│  packages veya build flag: APP_TARGET=native | web      │
├──────────────────────┬──────────────────────────────────┤
│  Web (SEO, desktop)  │  iOS (Expo native)               │
│  SSR / static        │  static export only              │
│  surface yok         │  surface/app shell varsayılan    │
│  sitemap, OG         │  OG gereksiz                     │
└──────────────────────┴──────────────────────────────────┘
         │                           │
         └──── paylaşılan ────────────┘
              components, data, types, dictionaries
```

### Somut adımlar (ürün fazları — release değil)

**Faz A — Kabuğu düzelt (1–2 hafta)**  
1. `capacitor.config.ts`: production’da `server.url` **yok**  
2. Next `output: 'export'` + tüm `[id]` / `[slug]` için `generateStaticParams`  
3. `images: { unoptimized: true }` veya harici img  
4. Dev’de `server.url` sadece canlı site test için  

**Faz B — App kodunu sadeleştir (1 hafta)**  
5. `SurfaceProvider` / `?surface=app` kaldır — native build’de her zaman app layout  
6. `DesktopTopNav`, desktop grid — web build’e `ifdef`  
7. Tek scroll modeli, tek `ResponsivePageContainer` (mobil)  

**Faz C — App UX (sürekli)**  
8. Ekran geçişleri: okuyucu açılırken bottom nav gizle (var), üst bar native tutarlılık  
9. Skeleton: kart listesi / okuyucu için shimmer (ağ yok artık ama ilk paint için)  
10. Okuyucuda tipografi ve satır uzunluğu — zaten iyi, paragraflar arası nefes  

**Faz D — İçerik cihazda (2 hafta)**  
11. TR JSON build’e gömülü; EN isteğe bağlı dil paketi  
12. Görseller: okunan kartların hero’sunu `Capacitor Filesystem` veya HTTP cache ile sakla  
13. “İçerik güncellemesi” için ileride: manifest + zip indirme (OTA) — v2  

---

## 5. UI/UX — Web hissinden kurtulmak

### Kaldırılması / sadeleştirilmesi gerekenler

| Öğe | Neden |
|-----|--------|
| `?surface=app` | Uygulama ayrı build olmalı |
| Çift layout (website / app) | App’te tek path |
| `sessionStorage surface_mode` | Gereksiz state |
| Web service worker (native’de) | Zaten kapalı — bundled’da tamamen kaldır |
| `maximumScale` tartışması | App’te erişilebilir zoom açık kalabilir |

### Eklenmesi gerekenler (native his)

| Öğe | Etki |
|-----|------|
| **Anında tab geçişi** | Bundled JS ile Link prefetch |
| **Okuyucu = tam ekran stack** | Large title yok ama sabit üst bar + swipe back |
| **Liste için native his** | Kartlarda `active:scale` var; liste divider, snap opsiyonel |
| **Boş / yükleme iskeleti** | Flash of white yerine arşiv tonunda skeleton |
| **Haptic** | Kaydet, tamamla, rota bitir (hafif) |
| **Paylaşım** | `navigator.share` — kart başlığı + deep link (bundled’da file:// değil custom scheme veya https) |
| **Pull-to-refresh** | Sadece OTA/content sync gelince anlamlı; şimdilik şart değil |

### Tipografi ve dokunma (ince ayar)

- Alt nav etiketleri 8px — okunabilir ama iOS HIG’de min 11pt tercih; **10–11px** denenebilir  
- Dokunma hedefleri min 44pt — geri butonu 40px → 44px  
- Okuyucu: flagship’te adım göstergesi daha görünür (progress pill)

---

## 6. İçerik deneyimi

### Güçlü (koru)

- Flagship guided journey + spoiler  
- Medya dosyası (dossier) kavramı  
- Günlük kart  
- Kaynakça blokları  

### Geliştir (ürün)

| Fikir | Değer |
|-------|--------|
| **Kart içi “bu bölüm” anchor** | Uzun okumada native TOC |
| **Okuma süresi kalan** | Üst barda “~4 dk kaldı” |
| **Dossier tamamlanma yüzdesi** | Medya sayfasında net ilerleme |
| **“Benzer 3 kart”** | Zaten var; dossier ile bağlantı güçlendir |
| **Sesli okuma** | v2; erişilebilirlik + premium his |
| **İçerik versiyonu** | Kart güncellendiğinde “güncellendi” rozeti (OTA ile) |

### İçerik + offline

Bundled JSON ile: tüm metin offline. Görseller için:

- Öncelik: thumbnail + hero lazy cache  
- Kabul: ilk açılışta görsel yoksa placeholder (tarihî çerçeve) — metin yine okunur

---

## 7. Fonksiyonellik

### Çekirdek döngü (tamam)

Keşfet → Oku → Kaydet → Devam et → Rota

### Eksik / zayıf (app beklentisi)

| Fonksiyon | Durum | Öneri |
|-----------|--------|--------|
| Offline okuma | Yok (hosted) | Bundled JSON |
| Anında arama | Ağ + SSR | Client-side filter |
| Bildirim (günlük kart) | Yok | v2, engagement |
| Widget (günlük kart) | Yok | v2, iOS WidgetKit |
| iCloud yedek | Yok | v2 veya “export progress” |
| Deep link | URL web’e bağlı | `trueframe://card/id` + universal link |
| İçerik arama indeksi | Basit string | Fuse.js / MiniSearch client-side |

### Fazlalık (app’te düşün)

- Web SEO metadata her sayfada — app build’de strip  
- Sitemap, robots — sadece web  
- Desktop 3 kolon grid — sadece web  

---

## 8. “Şu anki his” vs “hedef his”

| An | Hedef |
|----|--------|
| Siteyi ikona tıklayarak açıyorum | Uygulamayı açıyorum |
| Sekme değişince bekliyorum | Sekme anında |
| Uçak modunda boş | Metinler okunur, görseller kısmen |
| URL mantığı kafamda | Ekran mantığı |
| Web sitesinin mobil hali | True Frame uygulaması |

---

## 9. Karar ağacı (sizin için)

```
İçerik ve UI kodunu korumak istiyor musunuz?
  ├─ Evet → Seçenek 1 (bundled Next export) + Faz A–D
  └─ Hayır, en hızlı app hissi → Seçenek 2 (SPA + JSON)

Web sitesi aynı repo’da kalsın mı?
  ├─ Evet → APP_TARGET flag / iki build script
  └─ Hayır → Mobil repo ayır (daha temiz app, daha fazla iş)

İçerik haftalık güncelleniyor mu?
  ├─ Evet → Faz D’de OTA content pack planla
  └─ Hayır → Sadece App Store güncellemesi yeter
```

**Pratik öneri:** Seçenek 1 ile başlayın; Faz A bitmeden UI cilası sınırlı fayda verir.

---

## 10. İlk sprint backlog (release yok — sadece ürün)

1. [x] `server.url` kaldırıldı — Capacitor `webDir: out` (bundled)  
2. [x] Static export + 542 sayfa (`npm run build:app`)  
3. [x] `NEXT_PUBLIC_APP_TARGET=native` — desktop nav/SW kapalı, app shell varsayılan  
4. [x] `SurfaceProvider` — native build’de her zaman app modu  
5. [ ] Explore araması tam client-side (kartlar zaten prop; isteğe bağlı indeks)  
6. [ ] Okuyucu üst bar + geri — UX iterasyonu  
7. [~] `AppSkeleton` eklendi; sayfalara bağlanacak  
8. [ ] Görsel cache stratejisi (v1.1)  

**Komutlar:** `npm run build:app` → `npx cap sync ios` (Mac’te Xcode)

---

## 11. Bilinçli olarak ertelenenler

- App Store görselleri, TestFlight, inceleme notu  
- React Native rewrite  
- Abonelik, hesap, sosyal  
- iPad özel layout (telefon odaklı kalabilir)  
- Karanlık mod (tutarlı light polish önce)

---

## Özet cümle

**İçerik ve özellikler zaten bir uygulama; mimari hâlâ bir web sitesi kabuğu.**  
En köklü ve en doğru hamle: **Capacitor’ın uzak URL yüklemesini bırakıp içeriği ve UI’ı IPA’ya gömmek**, ardından web/app çift yüzünü build ile ayırmak.  
Bundan sonra yapılacak her UI iyileştirmesi “gerçek uygulama” üzerine inşa edilir; şu anki hosted modelde ise tavan düşük kalır.
