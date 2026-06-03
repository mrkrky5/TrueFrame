# True Frame — TestFlight regresyon testleri

**Amaç:** Her yeni TestFlight build’inde uygulamanın temel işlevlerinin kırılmadığını doğrulamak.  
**Platform:** iPhone (TestFlight veya development build)  
**Süre:** ~30–45 dk (tam) · ~12 dk (smoke)

Her satır: ☐ geçti · ☐ kaldı · not.

Build: `1.0.0 (___)` · Tarih: ___ · Cihaz / iOS: ___

---

## A. Kurulum ve genel sağlık

| # | Senaryo | Adımlar | Beklenen |
|---|---------|---------|----------|
| A1 | İlk açılış | Uygulamayı temiz kur (sil-yükle) veya ilk kez aç | Onboarding; çökme yok |
| A2 | Onboarding tamamlama | “Keşfetmeye başla” (veya eşdeğeri) | Ana shell (alt sekmeler) görünür |
| A3 | Soğuk açılış | Uygulamayı kapat → tekrar aç | Önceki sekme / ilerleme mantıklı; beyaz ekran yok |
| A4 | Offline metin | Uçak modu → Ana sayfa, Keşfet, bir kart aç | Kart metinleri yüklenir (gömülü veri) |
| A5 | Ağ ile görsel | Wi‑Fi açık → görselli kart / medya | Görseller yüklenir veya kırık görselde boş kutu çökme yapmaz |
| A6 | Safe area | Ana sayfa, Keşfet, Rotalar, Kitaplık, Ayarlar | Notch altında içerik; aşırı üst boşluk yok |
| A7 | Sekme geçişi | Dört ana sekmeyi sırayla aç | Her sekme yüklenir; tab bar tutarlı |
| A8 | Tab bar okuma modu | Kart okuyucu aç | Alt tab bar gizlenir; çıkınca geri gelir |

---

## B. Navigasyon ve geri dönüş

| # | Senaryo | Adımlar | Beklenen |
|---|---------|---------|----------|
| B1 | Üst geri butonu | Keşfet → kart → üst geri | Keşfet listesine döner |
| B2 | iOS swipe-back (Keşfet) | Keşfet → kart → **soldan sağa kaydır** | Keşfet; çift animasyon / yanlış ekran flash yok |
| B3 | Swipe-back (Rotalar) | Rotalar → rota → kart → kaydır | Rota detayına döner |
| B4 | Swipe-back (Kitaplık) | Kitaplık → kart → kaydır | Kitaplığa döner |
| B5 | Swipe-back (medya dosyası) | Keşfet → medya dossier → kart → kaydır | Önce dossier, tekrar kaydır → Keşfet |
| B6 | İlgili kart zinciri | Kart A → related → kart B → kaydır | B’den A’ya; A’dan listeye |
| B7 | Derin navigasyon | Ana sayfa → rota → kart → geri zinciri | Her adımda doğru geri hedefi |
| B8 | Ayarlar / yasal geri | Ayarlar → Gizlilik → geri | Ayarlara, sonra shell |

---

## C. Ana sayfa

| # | Senaryo | Adımlar | Beklenen |
|---|---------|---------|----------|
| C1 | Günlük kart | Günlük / bugünün kart alanı | Görünür; dokunulabilir |
| C2 | Günlük okuma | Günlük karta gir → çık | Okuyucu; geri çalışır |
| C3 | Devam et | Yarım kalan kart | Doğru karta gider; yüzde mantıklı |
| C4 | Rota önizlemesi | Ana sayfa rota bloğu | Tıklanınca rota detayı |
| C5 | Dil kısayolu | Dil butonu (varsa) | Sheet; seçim uygulanır |
| C6 | Scroll | Sayfayı kaydır | Akıcı; kesilme yok |

---

## D. Keşfet

| # | Senaryo | Adımlar | Beklenen |
|---|---------|---------|----------|
| D1 | Liste yükleme | Keşfet sekmesi | Kart listesi dolu |
| D2 | Arama | “Roma”, “Viking”, “Shogun” | Sonuçlar filtrelenir |
| D3 | Boş arama | Olmayan kelime | Boş durum mesajı |
| D4 | Ruh hali filtresi | Mood chip seç | Liste değişir; anlamsız 0 sonuç yok |
| D5 | Tür / doğruluk filtresi | Filtre + temizle | Liste güncellenir |
| D6 | Flagship rozeti | FLAGSHIP kart | Rozet görünür |
| D7 | Liste tipografisi | Başlık stili | Okunaklı; tutarlı |
| D8 | Medya dosyası | Dossier kapak kartı | Medya sayfası; kart listesi |
| D9 | Dossier paylaşım | Paylaş | iOS share sheet |
| D10 | Eksik medya talebi | Varsa alt blok | Mailto / form; çökme yok |
| D11 | Reklam alanı | Alt / inline slot | Layout kırılmaz |
| D12 | Sekme scroll | Kaydır → başka sekme → Keşfet | Makul scroll konumu |

---

## E. Rotalar

| # | Senaryo | Adımlar | Beklenen |
|---|---------|---------|----------|
| E1 | Rota listesi | Rotalar sekmesi | Birden fazla rota |
| E2 | Rota detay | Bir rotaya gir | Kart listesi; ilerleme |
| E3 | Rota → kart | Listeden kart | Okuyucu açılır |
| E4 | Liste tipografisi | Rota kart satırı | Okunaklı; Keşfet ile uyumlu |
| E5 | İlerleme | Kart oku / tamamla | Çubuk artar |
| E6 | Farklı temalar | 3+ rota örnekle | Hepsi içerikli |
| E7 | tf26 kartları | tf26 içeren rotada kart aç | Metin yüklenir |
| E8 | Çift konu | Aynı olay iki kart (varsa) | Not al (ürün); ikisi de açılır |

---

## F. Kart okuyucu

| # | Senaryo | Adımlar | Beklenen |
|---|---------|---------|----------|
| F1 | Lite okuyucu | Non-flagship | Tek sütun; spoiler (gerekiyorsa) |
| F2 | Flagship | Flagship kart | Sayfalı / bölümlü okuma |
| F3 | Spoiler kapısı | Spoiler’lı kart | Onay sonrası içerik |
| F4 | Uzun metin | Flagship sonuna kadar | Akıcı gezinme |
| F5 | Kaynak linki | Dış kaynak | Safari / harici tarayıcı |
| F6 | Kaydet | Bookmark | Kitaplık’ta görünür |
| F7 | Paylaşım | Share | Share sheet |
| F8 | Tamamlama | Bitir | Tamamlama / devam aksiyonları |
| F9 | Hero görsel | Görselli kart | Görsel görünür |
| F10 | Kırık görsel | Bozuk URL’li kart | Boş hero kutusu yok; metin devam |
| F11 | İlgili kartlar | Related | Tıklanır; ölü link yok |
| F12 | Ek bloklar | Reflection / reality check | Layout bozulmaz |

---

## G. Kitaplık ve ilerleme

| # | Senaryo | Adımlar | Beklenen |
|---|---------|---------|----------|
| G1 | Kaydet / kaldır | Kaydet → Kitaplık → kaldır | Liste güncellenir |
| G2 | Son okunanlar | Birkaç kart aç | Ana sayfa / kitaplık güncellenir |
| G3 | İlerleme kalıcılığı | Yarım bırak → kapat → aç | Yüzde korunur |
| G4 | Boş kitaplık | Kayıt yok | Boş durum mesajı |
| G5 | Kitaplık swipe-back | Kart → kaydır | Kitaplığa döner |

---

## H. Dil ve yerelleştirme

| # | Senaryo | Adımlar | Beklenen |
|---|---------|---------|----------|
| H1 | Türkçe | TR mod | UI + kartlar TR |
| H2 | İngilizce | EN seç | UI EN |
| H3 | EN içerik | EN’de kartlar | Türkçe sızıntı yok |
| H4 | EN rotalar | Rota adları | Okunur EN |
| H5 | TR dönüş | Tekrar TR | Tutarlı |
| H6 | Hata ekranı | 404 / hata | Yerelleştirilmiş |

---

## I. Ayarlar ve yasal

| # | Senaryo | Adımlar | Beklenen |
|---|---------|---------|----------|
| I1 | Ayarlar | Ayarlar aç | Normal layout |
| I2 | Gizlilik | Politika | Uygulama içi |
| I3 | Şartlar | Terms | Açılır |
| I4 | Destek | Support | Açılır / mailto |
| I5 | Marka | Hakkında | “True Frame” |
| I6 | Bildirim metni | Hatırlatma açıklaması | Anlaşılır |
| I7 | Veri | Sil-yükle | Onboarding tekrar |

---

## J. Reklamlar (iOS)

| # | Senaryo | Adımlar | Beklenen |
|---|---------|---------|----------|
| J1 | Keşfet | Scroll | Slot veya boş; kırık layout yok |
| J2 | Okuma sonrası | Kart çıkışı | Slot (varsa) |
| J3 | Offline | Uçak modu | Çökme yok |

---

## K. İçerik örnekleme (ürün notu)

Her build’de 2 eski + 2 yeni kart bilinçli aç:

| Tip | Örnek | Bakılacak |
|-----|--------|-----------|
| Eski | Renkli Atina, Shogun | Dolu metin |
| tf26 | Demiryolu, 1917 | Şablon / kısa alt başlık |
| Dossier | AC, Vikings | Liste doluluğu |

---

## L. Performans

| # | Senaryo | Beklenen |
|---|---------|----------|
| L1 | Hızlı sekme geçişi | Çökme yok |
| L2 | Ardışık 5 kart aç-geri | Crash yok |
| L3 | Uzun Keşfet scroll | Kabul edilebilir FPS |
| L4 | Arka plan → dönüş | State bozulmaz |

---

## Smoke (12 dk)

1. A1–A2 · 2. B2 · 3. D2, D4 · 4. E2–E3 · 5. F2, F5 · 6. G1 · 7. H2, H5 · 8. I2

---

## Hata raporu

```
Build: 1.0.0 (___)
Senaryo: (örn. B2)
Adımlar / Beklenen / Gerçekleşen / Kart ID / Ekran görüntüsü
```

---

## Build kaydı

| Build | Tarih | Smoke | Tam | Bloker | Not |
|-------|-------|-------|-----|--------|-----|
| | | | | | |

---

*True Frame — TestFlight regresyon rehberi*
