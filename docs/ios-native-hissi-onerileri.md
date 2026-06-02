# iOS’ta “Gerçek Uygulama” Hissi — Araştırma ve Öneriler

> True Frame hedefi Expo (React Native) + gömülü içerik; eski Capacitor hosted WebView yolu emekli. Aşağıdaki maddeler **kabuk ve algı** tarafını güçlendirir.

---

## Neden “web sitesi gibi” hissedilir?

| Algı kaynağı | Açıklama |
|--------------|----------|
| Hosted WebView | İlk açılışta URL yüklemesi, yavaş ağda boş ekran |
| Harici linkler WebView’da kalır | Kaynaklar “sitede gezinme” gibi hissettirir |
| Safari benzeri chrome | Adres çubuğu yok ama scroll/zoom davranışı web gibi |
| PWA / SW karışımı | Cache ile canlı site çakışabilir |
| Eksik native geri bildirim | Dokunma, haptic, paylaşım zayıf kalır |
| Mağaza varlıkları | İkon, splash, ekran görüntüleri “beta” veya tutarsız ise güven düşer |

Apple [Guideline 4.2](https://developer.apple.com/app-store/review/guidelines/) bazen “minimum functionality” ile saf site sarmalayıcılarını reddeder. **Sizin farkınız:** kütüphane, rotalar, spoiler gate, guided reader, cihazda durum — bunları hem üründe hem mağaza anlatısında öne çıkarın.

---

## Kodda yapılanlar (bu PR)

| Madde | Etki |
|-------|------|
| `@capacitor/browser` ile dış linkler | Kaynaklar Safari / SFSafariViewController’da açılır |
| iOS status bar (`Style.Dark`, overlay kapalı) | Üst çubuk native uygulamalarla uyumlu |
| `NativeLocaleBootstrap` | İlk açılışta cihaz dili EN ise `/en` |
| Haptic (kaydet) | Küçük ama “native” dokunuş |
| SW sadece web’de | Native’de stale cache riski azalır |
| `userScalable: true` | App Review erişilebilirlik beklentisi |
| iOS app shell CSS | overscroll, 16px input (zoom önleme) |
| `/support` sayfası | App Store destek URL’si |
| `@capacitor/ios` + `capacitor.config` iOS bloğu | Xcode projesi eklenebilir |

---

## Öncelik sırası — “daha iOS gibi” görünmek için

### Hemen (Mac + tasarım)

1. **1024×1024 App Icon** — tek renk zemin + serif “MG” veya arşiv mührü; ASO’da tanınır
2. **Launch Screen** — düz `#FAF9F6`, ortada logo, spinner yok (Apple önerisi)
3. **6.7" ekran görüntüleri** — gerçek cihaz veya doğru çerçeve; web tarayıcı çerçevesi yok
4. **TestFlight** — 5–10 kişi, ilk 30 sn onboarding + bir flagship okuma

### Kısa vadede (mühendislik)

5. **Splash Screen plugin** (`@capacitor/splash-screen`) — beyaz flaş yerine marka rengi
6. **Pull-to-refresh kapatma** — ana shell’de gereksizse `overscroll-behavior` (kısmen yapıldı)
7. **Paylaşım** — `navigator.share` zaten var; mağaza ekranında “Paylaş” gösterin
8. **Derin link / Universal Links** — `trueframe.app/card/...` uygulamada açılsın (v1.1)

### Orta vadede (en büyük algı farkı)

9. **Gömülü static build** — `next export` + `webDir: out`: ilk ekran anında, offline kısmi
10. **Son okunan cache** — IndexedDB ile 1–2 kart offline (hosted modda bile)
11. **iPad `regular` content mode** — `preferredContentMode` tablet için (config’te mobile seçildi; telefon odaklı v1 doğru)

### Mağaza ve güven (kod dışı)

12. **App Store açıklaması** — “190+ dosya, hesap yok, cihazda gizlilik” (`docs/app-store-metinleri.md`)
13. **App Review notu** — demo yolu (`docs/app-review-demo-yolu.md`), internet gerekli
14. **Destek URL** — `https://trueframe.app/tr/support`
15. **Gizlilik anketi** — “Data Not Collected” veya yalnızca cihazda saklama

---

## Hosted vs gömülü — karar özeti

| | Hosted (v1) | Gömülü (v1.1+) |
|--|-------------|----------------|
| İlk açılış | Ağa bağlı | Anında shell |
| Offline | Zayıf | Kısmi mümkün |
| Güncelleme içerik | Sunucu deploy | App güncellemesi veya OTA |
| 4.2 riski | Biraz daha yüksek | Daha düşük |
| Karmaşıklık | Düşük | Next static export gerekir |

**Öneri:** TestFlight’ı hosted ile başlatın; 4.2 geri bildirimi gelirse gömülü build’e geçin.

---

## iOS kullanıcılarının beklediği küçük detaylar

- **Kenar kaydırma ile geri** — WKWebView varsayılan; custom back butonunuz da var
- **Home indicator alanı** — bottom nav `safe-area-inset-bottom` (mevcut)
- **Klavye** — arama input 16px+ font (globals’da eklendi)
- **Modal paylaşım** — native share sheet
- **Harici link** — Safari’de açılır (artık Browser plugin)
- **Titreme yok** — ağır animasyonları `prefers-reduced-motion` ile sınırlı (mevcut)

---

## Yapmamanız gerekenler

- Web sitesinin adres çubuğunu taklit etmek
- Her ekranda “Powered by web” mesajı
- Beta rozeti veya eksik ikonla gönderim
- `mailto:` tek başına destek URL’si (support sayfası eklendi)
- Service Worker’ı native’de aktif bırakmak (kapatıldı)

---

## Sonraki adım (sizin tarafınız)

1. Mac’te: `npm install` → `npx cap add ios` → `npx cap sync ios` → Xcode’da imzalama
2. Tasarımcıdan veya Figma’dan **App Icon + splash** export
3. TestFlight build → `docs/ios-release-yapilacaklar.md` TestFlight listesi
4. App Store Connect’e destek + gizlilik URL’lerini girin
