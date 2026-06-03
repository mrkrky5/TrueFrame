# App Store Connect — Mağaza listesi (adım adım)

**Ne zaman:** Build **16** TestFlight’ta test edildikten ve onaylandıktan sonra.  
**Hedef:** 1.0.0 sürümünü incelemeye hazır hale getirmek (henüz **canlı değil**).

Ön koşul: [appstoreconnect.apple.com](https://appstoreconnect.apple.com) → **True Frame Media** (`com.trueframe.app`) uygulaması açık.

---

## Aşama 0 — Build 16 hazır mı?

1. Sol menü → **TestFlight** → **iOS**  
2. **Build Uploads** altında **1.0.0 (16)** → durum **Complete** (Processing değil)  
3. İstersen iPhone’da TestFlight ile **16**’yı dene  

☐ Build 16 Complete  
☐ TestFlight smoke OK  

---

## Aşama 1 — Uygulama bilgisi (bir kez / güncelleme)

Sol menü → **App Store** (veya **Distribution** → **App Store**) → uygulama seçili.

### 1.1 App Information

| Alan | Ne yazılır |
|------|------------|
| **Name** (EN + TR aynı) | **True Frame Media** |
| **Subtitle** EN (30 karakter) | `The History Behind the Media` |
| **Subtitle** TR (30 karakter) | `Medyanın Ardındaki Tarih` |

**Lokalizasyon:** English (U.S.) ve Turkish’te **Name** → `True Frame Media` (yalnızca mağaza).

**Marka ayrımı:** Uygulama içi, web ve `mobile/app.json` → **True Frame**. Mağaza listesi → **True Frame Media** (Apple’da kısa isim dolu). İnceleme notunda her ikisi belirtilir: `docs/ios-app-review-notu.md`.
| **Category** Primary | **Education** (Eğitim) |
| **Category** Secondary | Reference veya Entertainment (isteğe bağlı) |
| **Content Rights** | Kendi içeriğiniz / uygun lisans (içerik size ait) |
| **Age Rating** | Anketi doldur → genelde **4+** (şiddet çok hafif metin varsa ankete göre) |

**Privacy / Support URL’leri** (GitHub Pages — `trueframe.app` DNS sonra):

| Dil | Privacy | Support |
|-----|---------|---------|
| TR | `https://mrkrky5.github.io/TrueFrame/tr/privacy/` | `https://mrkrky5.github.io/TrueFrame/tr/support/` |
| EN | `https://mrkrky5.github.io/TrueFrame/en/privacy/` | `https://mrkrky5.github.io/TrueFrame/en/support/` |

App Privacy (tek alan): EN privacy önerilir. App Information / 1.0.0: lokalizasyona göre TR veya EN.

Deploy: [`legal-site-deploy.md`](./legal-site-deploy.md)

Kaydet.

☐ App Information tamam

### 1.2 App Icon (1024)

Aynı dosya: Mac/Windows’taki `mobile/assets/images/icon.png` (1024×1024).

- **App Information** veya sürüm sayfasında **App Icon** alanı  
- PNG yükle, şeffaf olmasın  

☐ 1024 ikon yüklü

---

## Aşama 2 — Sürüm 1.0.0

Sol menü → **App Store** → sol tarafta **iOS App** altında **1.0.0** (yoksa **+ Version** / **Prepare for Submission** ile **1.0.0** oluştur).

### 2.1 Build seçimi

1. Sürüm sayfasında **Build** bölümü → **+** veya **Select Build**  
2. Listeden **1.0.0 (16)** seç (**15 değil**)  
3. Kaydet  

Export compliance sorulursa (build’e bağlı):

- “Uses encryption?” → **Yes** (HTTPS)  
- “Exempt?” / standard → **Yes** (sadece standart şifreleme)  

☐ Build 16 bağlı

### 2.2 Ekran görüntüleri

**Gerekli boyutlar (iPhone):**

| Cihaz | Connect’te görünen ad | Nasıl alınır |
|--------|------------------------|--------------|
| 6.7" | iPhone 15 Pro Max / 14 Pro Max vb. | En büyük iPhone ekran görüntüsü |
| 6.5" | iPhone 11 Pro Max / XS Max vb. | İkinci boyut veya aynı set (Connect bazen birini kabul eder) |

**Pratik:** TestFlight **16** yüklü iPhone’da ekran görüntüsü al → Mac’e AirDrop → Connect’e sürükle.

**Önerilen 5–6 kare (sıra):**

1. Onboarding  
2. Ana sayfa (günlük kart)  
3. Keşfet (arama / grid)  
4. Medya dosyası (dossier)  
5. Flagship okuyucu  
6. Rotalar veya Kitaplık  

Her boyut sekmesine aynı seti yükle (Connect her sekme için ayrı ister).

☐ 6.7" screenshots  
☐ 6.5" screenshots (veya Connect’in istediği ikinci boyut)

### 2.3 Metinler (Türkçe — ilk çıkış)

**Promotional Text** (isteğe bağlı, 170 karakter, sonradan güncellenebilir):

```
Popüler oyun, film ve dizilerin arkasındaki gerçek tarihi keşfedin. Hesap gerekmez; okuma ilerlemeniz cihazınızda kalır.
```

**Description** (açıklama — örnek taslak, düzenleyebilirsin):

```
True Frame, sevdiğiniz medyanın arkasındaki tarihi gerçekleri anlaşılır ve kaynaklı biçimde sunan bir keşif uygulamasıdır.

• Oyun, film ve dizilerden ilham alan tematik kartlar ve öğrenme rotaları
• Spoiler korumalı derin okuma ve kısa “gerçeklik kontrolü” kartları
• Hesap yok — kayıtlı kartlar ve ilerleme yalnızca cihazınızda
• Kaynak linkleri Safari’de açılır

Eğitim amaçlıdır; resmi tarih dersinin yerine geçmez, meraklı okur için tasarlanmıştır.
```

**Keywords** (virgül, boşluksuz veya Apple formatına göre, ~100 karakter):

```
tarih,medya,oyun,film,dizi,eğitim,tarihsel,gerçekler,belgesel,öğrenme
```

**Support URL** (sürüm, lokalizasyona göre): TR veya EN tablo yukarıda  
**Marketing URL** (isteğe bağlı): boş veya `https://mrkrky5.github.io/TrueFrame/`

☐ Açıklama + anahtar kelimeler

### 2.4 İnceleme bilgisi

Sürüm sayfasında **App Review Information**:

| Alan | Değer |
|------|--------|
| **Sign-in required** | **No** |
| **Contact** | Ad, soyad, telefon, e-posta (Apple ulaşabilsin) |
| **Notes** | `docs/ios-app-review-notu.md` içindeki **English** metni yapıştır |

Demo hesap gerekmez.

☐ Review notes yapıştıldı

### 2.5 Versiyon yayın bilgisi

**Copyright** örnek: `2026 Emre Karakaya` (veya şirket adın)  
**Version** zaten 1.0.0  

☐ Copyright

---

## Aşama 3 — App Privacy (gizlilik anketi)

Sol menü → **App Privacy** (uygulama düzeyinde, sürümden bağımsız).

1. **Get Started** / anketi başlat veya güncelle  
2. **Data collected?** → Uygulama reklam + yerel depolama varsa genelde **Yes**  
3. Tipik beyanlar (rehber — hukuk danışmanına göre netleştir):
   - **Identifiers** (reklam) — AdMob kullanıyorsanız ilgili maddeler  
   - **Usage Data** — reklam analitiği (AdMob politikasına göre)  
   - Okuma ilerlemesi **yalnızca cihazda** ve sunucuya gitmiyorsa → çoğu madde **Not Collected** veya “On device only”  
4. **Privacy Policy URL:** `https://trueframe.app/tr/privacy`  

Reklam kullandığınız için anketi atlama; Apple ve AdMob ile uyumlu doldurun.

☐ App Privacy anketi tamam

---

## Aşama 4 — Fiyat ve yayın

| Alan | Öneri |
|------|--------|
| **Price** | Free (Ücretsiz) |
| **Availability** | Türkiye + istediğin ülkeler |
| **Pre-order** | Hayır (ilk sürüm) |

---

## Aşama 5 — Gönderim

1. Sürüm **1.0.0** sayfasında eksik kırmızı uyarı kalmadığını kontrol et  
2. **Add for Review** / **Submit for Review**  
3. Export compliance / reklam / yaş — son soruları yanıtla  
4. Gönder  

Durum: **Waiting for Review** → **In Review** → **Ready for Sale** (onay).

☐ Submit for Review tıklandı

---

## Onay sonrası (canlı)

1. **Ready for Sale** olunca App Store’da görünür (bazen birkaç saat gecikme)  
2. **Release** otomatik seçili değilse: sürümde **Release This Version**  
3. İlk yorumları / crash raporlarını App Store Connect → **Analytics / Crashes** üzerinden izle  

---

## Hızlı kontrol listesi (kopyala)

```
□ Build 16 Complete + TestFlight OK
□ App Information: Name True Frame Media (EN+TR), subtitle, kategori, privacy & support URL
□ 1024 App Icon
□ Version 1.0.0 → Build 16
□ Screenshots 6.7" (+ 6.5")
□ Description + keywords + copyright
□ Review notes (ios-app-review-notu.md EN)
□ App Privacy survey
□ Submit for Review
```

---

## Sık sorular

**Build 15 ile gönderebilir miyim?**  
Test için evet; **inceleme için 16** (ikon + production reklam).

**İngilizce mağaza metni şart mı?**  
İlk çıkış TR odaklı olabilir; sonra **+ Localization** → English eklersin.

**TestFlight ile App Store aynı build mi?**  
Evet — Submit for Review’da seçtiğin build mağazaya gider.

---

Build 16 testini bitirince “hazırım” yaz; Connect’te takıldığın ekranın adını (İngilizce menü metni) söyle, o ekrana özel devam ederiz.

*İlgili: `app-store-release.md`, `ios-app-review-notu.md`, `testflight-regression.md`*
