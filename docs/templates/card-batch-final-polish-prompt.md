# True Frame — Final polish prompt (v2 → v3)

**Girdi:** `true-frame-card-batch-200-v2.json` (QC geçmiş; uzunluk ve flagship yapısı iyi)  
**Çıktı:** `true-frame-card-batch-200-v3.json` — import’a hazır final

Önceki tur: `card-batch-revision-prompt.md` (v1→v2). Bu tur **kısaltma yok**, sadece şablon temizliği + kaynak + yazım.

---

## Kopyala-yapıştır prompt

```
Sen True Frame mobil uygulaması için son tur içerik editörüsün. Sana verilen JSON (v2, meta.version: 2) üzerinde FINAL POLISH yap. Bu bir yeniden yazım değil: id, yapı, uzunluk ve flagship oranı korunur; ama kalan şablonlar ve yazım hataları tamamen giderilir.

## Çıktı
- Tek geçerli JSON: meta + batches[tr, en]
- meta.version = 3
- meta.notes = "final polish: şablon cümleler, unicode, kaynak çeşitliliği"
- 200 TR + 200 EN; id’ler tf26-* aynı kalır; parça parça teslim etme

## ASLA BOZMA (v2’den koru)
- Kart sayısı, id listesi, relatedCardIds, themes, tags, isFlagship dağılımı (50 flagship)
- Flagship: TR realHistory ≥400 kelime, en az 2× \n\n### Başlık\n
- Standart: TR realHistory ~150–280 kelime (kısaltma yapma)
- readingTimeMinutes mevcut değerlere yakın kalsın (~180 kelime = 1 dk)
- TR/EN parity: aynı id, isFlagship, mediaType, spoilerLevel, accuracyType
- contentBlocks ekleme

---

## 1. Yasak cümleler (tamamen kaldır veya kart başına benzersiz yeniden yaz)

Aşağıdaki kalıplar dosyada tekrar ediyor; hiçbiri çıktıda kalmasın:

TR whatWeSee:
- "…sahnede nasıl hızla okunur hale geldiğine ve gerçek tarihte hangi zemine oturduğuna bakar."
- "Bu kart, özellikle … ayrıntısının …"

TR mediaChanged (şablon gövde):
- "…konusunu daha görünür, daha kişisel ve daha hızlı anlaşılır hale getirir. Gerçekte aynı başlık, … içinde kurumlar, yerel koşullar ve uzun vadeli sonuçlarla birlikte ilerler."

TR whyItMatters:
- "…ayrıntısını bilmek, sahneyi sadece doğru-yanlış diye yargılamayı önler. İzleyici, … içindeki dramatik seçimin hangi tarihsel gerçekleri öne çıkardığını …"

TR realHistory (dolgu):
- "True Frame açısından ilginç olan ise tam bu kısaltmadır"
- "Bu son ayrım, … yalnızca görsel atmosfer değil"
- "en değerli okuma tam bu aralıkta başlar" (veya benzer kapanış şablonu)
- Aynı yapım bloğunda (10 kart) birbirine %25’ten fazla kelime örtüşen paragraf

EN: aynı anlamdaki tekrarlayan İngilizce kalıpları da kaldır.

---

## 2. whatWeSee — her kart farklı (zorunlu)

- 1–2 cümle; şimdiki zaman.
- Somut: mekân, karakter, görev, sahne, kamera/oyun mekaniği.
- İkinci cümle ASLA meta-açıklama olmasın ("bu kart şuna bakar" yok).
- Örnek iyi TR: "Origins'te İskenderiye'de kütüphane avlusunda dolaşırken arşiv görevleri ve bilgin NPC'leri görürsün; kütüphane tek bir bina değil, şehrin entelektüel merkezi gibi sunulur."

---

## 3. mediaChanged + whyItMatters — kart başına özgün

- mediaChanged: medyanın BU konuyu nasıl çarpıttı/sadeleştirdiği; 2–3 cümle; başlık adı geçsin.
- whyItMatters: okuyucuya "neden umursamalı" — tarihsel sonuç veya bugünkü yanılgı; 2 cümle.
- İki kartta ardışık aynı fiil yapısı ("daha görünür…", "sadece doğru-yanlış…") olmasın.

---

## 4. realHistory — dolgu azalt, somutluk artır

- Her kartta en az: 1 tarih aralığı veya yüzyıl, 1 yer adı, 1 somut kurum/olay/kişi (konuya uygun).
- "Medya kısaltır / sahne akmalı" cümlesi kart başına en fazla 1 kez, mümkünse hiç.
- Flagship’lerde ### bölümleri koru; bölüm başlıkları konuya özel olsun (genel "Tarihsel zemin" yerine "Ptolemaios arşivleri" gibi).

---

## 5. accuracyNote + quickRealityCheck

- accuracyNote: bu kartın tek iddiasına özel; "tarihsel kapı açmak için işe yarar" cümlesini 200 kartta tekrarlama.
- quickRealityCheck: tek soru cümlesi; medya adı + bu konunun özü.

---

## 6. Türkçe yazım (unicode)

- Birleşik "i + nokta" (i̇, i̇skenderiye) düzelt: normal İ/i ve Türkçe büyük/küçük harf (İskenderiye, i̇ → İ).
- whatWeSee içinde küçük harfli bozuk anahtar kelime bırakma ("i̇skenderiye kütüphanesi" → düzgün Türkçe).
- NFC normalizasyonu uygula.

---

## 7. Kaynaklar (sources)

- Her kart: en az 1 kaynak; mümkünse 2.
- Wikipedia tek başına yeterli DEĞİL: en az 1 kartta 2. kaynak şunlardan biri olsun:
  - britannica.com (konuya özel madde, genel ülke sayfası değil)
  - .edu / .gov / müze / arşiv / UNESCO / metmuseum / britishmuseum vb.
- Kartların en az %40’ında Wikipedia DIŞI en az 1 kaynak olsun (tüm dosyada).
- title = gerçek sayfa başlığı; url https ve konuyla uyumlu.
- sourceQuality: "strong" sadece gerçekten güçlü kaynak varsa; zayıfsa "medium".

---

## 8. subtitle

- "Sahnenin kaçırdığı ayrıntı: X" veya "Tek görüntünün ötesindeki tarih: X" kalıbını en fazla %10 kartta kullan; çoğu kartta farklı yapı (soru, iddia, yanlış bilinen).

---

## 9. Diğer alanlar

- misconception: konuya özel; aynı cümle yapısını 10’lu blokta tekrarlama.
- mediaConnection: kısa ve bu yapıma özel (kopya "belirli bir tarihsel görüntüden" tekrarını azalt).
- EN metinler: doğal İngilizce; Türkçe karakter (ğ, ı, ş, İ) yok.

---

## Kendi kontrol listesi (çıktıdan önce)

- [ ] 200×2 kart, tüm tf26-* id’ler mevcut
- [ ] Yasak kalıp araması: "hızla okunur hale geldiğine" = 0 sonuç
- [ ] "daha görünür, daha kişisel" = 0 sonuç
- [ ] "sadece doğru-yanlış diye yargılamayı" = 0 sonuç
- [ ] Flagship TR ≥400 kelime, ### var
- [ ] Unicode i̇ yok
- [ ] ≥80 kartta Wikipedia dışı kaynak (veya 2 kaynaklı kart oranı ≥%40)
- [ ] JSON geçerli

Sadece revize JSON döndür; markdown açıklama yazma.
```

---

## AI’ya ek not (isteğe bağlı)

Model tek seferde yetmezse şunu ekle:

```
4 parça üret: meta.part 1-4, partsTotal 4, id aralığı tf26-001..050, 051..100, 101..150, 151..200.
Her parçada TR+EN birlikte. Son parçada meta.part kaldırıp birleştirilmiş tek JSON da verebilirsin.
```

---

## Senin tarafında (import öncesi)

| Adım | Komut |
|------|--------|
| QC | `node scripts/import-card-batch.mjs docs/incoming/true-frame-card-batch-200-v3.json` |
| Import | aynı komut + `--write` |
| Denetim | `npm run content:audit && npm run mobile:sync && npm run mobile:check` |

v2 ile karşılaştırma: v2 import edilmediyse doğrudan v3’ü import et; v2 yazıldıysa v3’te `--replace` kullan.

---

## Hızlı kontrol (v3 geldikten sonra)

PowerShell / terminal:

```bash
node -e "const j=require('./docs/incoming/true-frame-card-batch-200-v3.json'); const t=j.batches.find(b=>b.locale==='tr').cards; const s=t.map(c=>c.whatWeSee).join(' '); console.log('hızla okunur:', (s.match(/hızla okunur/g)||[]).length); console.log('doğru-yanlış:', (s.match(/doğru-yanlış/g)||[]).length);"
```

İkisi de **0** olmalı.
