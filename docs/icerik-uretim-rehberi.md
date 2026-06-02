# True Frame — İçerik üretim rehberi (dış AI için)

Bu belge, **True Frame** uygulamasına eklenecek yeni kartların nasıl yazılacağını tanımlar. Metinleri bu kurallara göre üret; çıktıyı **tek bir JSON dosyasında** (ör. 200 kart TR + 200 kart EN) ver. Geliştirici `scripts/import-card-batch.mjs` ile `data/cards.tr.json` / `data/cards.en.json` dosyalarına işler.

Boş şablon: `docs/templates/card-batch-200.json`

---

## 1. Uygulama ne?

**True Frame** — oyun, film ve dizilerde gördüğünüz sahneler ile **gerçek tarih** arasındaki farkı anlatan bir eğitim/keşif uygulaması.

- Hesap yok; ilerleme cihazda.
- Ton: merak uyandıran, saygılı, akademik ama **soğuk değil**; ders kitabı değil, iyi bir belgesel anlatıcısı gibi.
- Hedef kitle: 18–45, medya seven, “gerçekten böyle miydi?” diye merak eden.
- Dil: **Türkçe (birincil)** ve **İngilizce**; aynı `id` ile çift kart üretilir.

**Marka cümlesi:** Medyada gördüğün ↔ tarihte olan.

---

## 2. Yazım tarzı (mutlaka uy)

| Yap | Yapma |
|-----|--------|
| Net, akıcı Türkçe / İngilizce | Ağır akademik jargon yığını |
| Somut örnek, tarih, isim, yer | “Tarihçiler der ki…” ile boş geçiştirme |
| Medyayı açıkça adla (Oppenheimer, AC Origins) | “Bu yapım” ile sürekli gizleme |
| Kaynaklı iddia; şüphede `accuracyNote`’ta belirt | Kesin bilinmeyeni kesin yazma |
| Kısa cümleler + gerektiğinde `###` alt başlık | Tek blok 2000 kelime duvarı |
| Okuyucuya “sen” hitabı (TR: sen/siz karışık olmasın — **sen** veya nötr “biz”) | Politik propaganda, güncel savaş polemiği |
| Spoiler’ı işaretle (`spoilerLevel`) | Film sonunu haber vermeden “merak et” |

**Örnek ton (TR `quickRealityCheck`):**
> Trinity Deneyi, sadece bir bombanın patlaması değil; insanlığın kendi sonunu getirme kapasitesine sahip olduğu yeni bir çağın başlangıcıydı. Oppenheimer, bu etik ve bilimsel gerilimi ne kadar yansıtıyor?

**Örnek ton (kısa kart `subtitle`):**
> Kirli olmayan gerçek tarih

**Örnek ton (`misconception`):**
> Bombanın sadece Oppenheimer tarafından yapıldığı sanılır; projede binlerce mühendis gizlilik içinde çalışmıştır.

---

## 3. Kart türleri

### A) Standart kart (`isFlagship: false`)

- Okuma: tek kaydırma ekranı.
- `readingTimeMinutes`: genelde **3–6** (kısa metinlerde 1–2 olabilir).
- `realHistory`: **1–3 paragraf** (toplam ~150–400 kelime TR).
- `whyItMatters` opsiyonel; kısa kartlarda boş bırakılabilir.

### B) Derin dosya / FLAGSHIP (`isFlagship: true`)

- Okuma: adım adım yolculuk (uygulama metinden otomatik böler).
- `readingTimeMinutes`: **6–12**.
- `realHistory`: **en az 2 bölüm**; paragraflar arası `\n\n`, bölüm başlıkları `\n\n### Başlık\n` ile.
- Mutlaka doldur: `mediaChanged`, `whyItMatters`, `accuracyNote`, `quickRealityCheck`.
- `spoilerLevel`: çoğunlukla `minor` veya `major` (film/ dizi sonu varsa).

---

## 4. JSON alanları — tek tek

Her kart bir nesne. Zorunlu alanlar **kalın**.

| Alan | Zorunlu | Açıklama | Uzunluk / format |
|------|---------|----------|------------------|
| **id** | evet | Benzersiz, küçük harf, tire: `oppenheimer-trinity` | İngilizce slug; TR/EN aynı id |
| **title** | evet | Kart başlığı (olay/konu) | 3–8 kelime |
| **subtitle** | evet | Alt başlık, merak cümlesi | 4–12 kelime |
| **mediaType** | evet | `game` \| `film` \| `series` \| `book` \| `general` \| `other` | |
| **mediaTitle** | evet | Yapım adı: `Oppenheimer`, `Assassin's Creed` | Dosyalar aynı isimle gruplanır |
| **whatWeSee** | evet | Medyada izleyiciye ne gösteriliyor | 1–2 cümle, şimdiki zaman |
| **realHistory** | evet | Asıl tarih metni | Bkz. §5 |
| **accuracyNote** | evet | Yapım ne kadar doğru; nerede kurgu | 2–4 cümle |
| **whyInteresting** | evet | “Bunu bilmen iyi olur” detayı | 1–2 cümle |
| **themes** | evet | 2–4 tema, uygulama büyük harfle gösterir | Örn: `Bilim`, `Savaş`, `Kültür` |
| **readingTimeMinutes** | evet | Tahmini okuma dakikası | Sayı |
| **sources** | evet | En az **1** kaynak | Bkz. §6 |
| **relatedCardIds** | evet | İlgili kart id’leri (boş dizi `[]` olabilir) | Aynı yapım veya konu |
| **nextTopics** | evet | Sonraki merak başlıkları (metin) | 2–4 kısa ifade |
| **difficulty** | evet | `basic` \| `medium` \| `deep` | |
| **verificationStatus** | evet | Hep `verified` (taslak üretme) | |
| **sourceQuality** | evet | `basic` \| `strong` | |
| **accuracyType** | evet | Bkz. §7 | |
| **spoilerLevel** | evet | `none` \| `minor` \| `major` | Bkz. §5b |
| **tags** | evet | Küçük harf slug: `savas`, `bilim`, `oppenheimer` | 4–8 tag |
| **quickRealityCheck** | çok önerilir | Keşfet listesinde görünen 1–2 cümle | Soru veya çarpıcı özet |
| **mediaChanged** | flagship’de evet | Medyanın tarihe ne eklediği/çarpıttığı | 2–4 cümle |
| **whyItMatters** | flagship’de evet | Bugün neden önemli | 2–3 cümle |
| **mediaConnection** | önerilir | “Bu kart X yapımından yola çıkar.” | 1 cümle |
| **misconception** | önerilir | Yaygın yanlış inanç | 1 cümle |
| **spoilerNote** | spoiler varsa | Spoiler kapısında ek uyarı | 1 cümle |
| **isFlagship** | evet | `true` / `false` | TR ve EN **aynı** |
| **era** | önerilir | `Antik Dünya`, `Orta Çağ`, `Modern Tarih` | |
| **region** | önerilir | `Roma`, `Japonya`, `ABD` | |
| **isPremium** | evet | Hep `false` | |
| **images** | hayır | Görsel URL ekleme (geliştirici ekler) | Atla |

**İsteğe bağlı (genelde atla):** `contentBlocks`, `similarMedia`, `publicationDate`, `lastReviewedAt`, `reviewerNote`

---

## 5b. `spoilerLevel` (TR etiketleri)

| Kod | Liste rozeti | Ne zaman |
|-----|--------------|----------|
| `none` | yok | Kurum, ekonomi, dönem; olay sonu / ölüm / twist yok |
| `minor` | İpucu | Karakter veya olay ipuçları; **son yok** |
| `major` | Son spoiler | Final, ölüm, twist, kim kazandı |

- `spoilerNote`: `none` → boş; `minor`/`major` → kısa uyarı (şablon cümle her karta kopyalama).
- Flagship kapısı UI’da **Derin okuma**; seviye rozette gösterilir.
- EN: `Hints` / `Ending`.

---

## 5. `realHistory` formatı

- Paragraflar arası: `\n\n`
- Uzun flagship metinlerde ara başlık:

```text
İlk paragraf giriş...

### Alt Başlık (cümle gibi, kısa)
Devam paragrafı...
```

- İlk paragraf: bağlam + neden önemli.
- Sonraki bölümler: kronoloji, toplum, sonuç.
- Abartılı süslü dil yerine **olgu + sonuç**.

**Uzunluk rehberi:**

| Tür | Kelime (TR) |
|-----|-------------|
| Standart | 150–400 |
| Flagship | 500–1200 |

---

## 6. Kaynaklar (`sources`)

Her kart en az bir gerçek URL:

```json
{
  "title": "The Manhattan Project (National Park Service)",
  "url": "https://www.nps.gov/mapr/learn/historyculture/index.htm",
  "type": "official",
  "verified": true
}
```

`type` örnekleri: `official`, `academic`, `article`, `museum`

- Wikipedia tek başına yeterli değil; mümkünse müze, üniversite, resmi kurum.
- Uydurma URL **yasak**.

---

## 7. Sınıflandırma alanları

### `accuracyType`

| Değer | Ne zaman |
|--------|----------|
| `real` | Yapım tarihe çok sadık |
| `partly-real` | Ana hatlar doğru, detaylar kurgu |
| `inspired-by-reality` | İlham almış, olaylar uyarlanmış |
| `fictionalized` | Karakter/olaylar büyük ölçüde kurgu |
| `fiction` | Tarihî arka plan yok / saf kurgu |

### `spoilerLevel`

| Değer | Ne zaman |
|--------|----------|
| `none` | Son/twist yok |
| `minor` | Bilinen olaylar, orta spoiler |
| `major` | Son, ölüm, büyük twist |

### `mediaType`

Gerçek yapım türüne göre seç. “Genel dönem” kartları için `general` + `mediaTitle`: `Genel Dönem Filmleri` (TR) / `Period Films` (EN).

---

## 8. `id` ve `mediaTitle` kuralları

**id örnekleri:**
- `oppenheimer-trinity`
- `ac-origins-siwa`
- `medieval-hygiene`
- `shogun-edo`

**mediaTitle normalizasyonu** (aynı dosyada toplanır):
- `Assassin's Creed Origins` → `Assassin's Creed`
- `Red Dead Redemption 2` → `Red Dead Redemption`
- `Kingdom Come: Deliverance II` → `Kingdom Come: Deliverance`

Yeni kart aynı oyuna/filme aitse **aynı `mediaTitle`** kullan.

---

## 9. Türkçe / İngilizce çift üretim

Her konu için **iki kart**: aynı `id`, aynı `isFlagship`, aynı `mediaType`, aynı `spoilerLevel`, aynı `accuracyType`.

| Alan | TR | EN |
|------|----|----|
| title, subtitle, tüm metin alanları | Türkçe | İngilizce |
| themes | Türkçe etiket: `Savaş`, `Bilim` | İngilizce: `War`, `Science` |
| tags | Türkçe slug: `savas`, `mitoloji` | İngilizce slug: `war`, `myth` |
| mediaConnection | “Bu kart, X yapımından yola çıkar.” | “This card explores the historical setting of X.” |

**EN metinde Türkçe karakter (ğ, ş, ı, ö, ü, ç) olmamalı** — istisna: özel isimler (Şōgun).

---

## 10. Tam örnek kart (TR, flagship — kısaltılmış)

```json
{
  "id": "ornek-kart-id",
  "title": "Trinity Deneyi",
  "subtitle": "Dünyaların yıkıcısı geldi",
  "mediaType": "film",
  "mediaTitle": "Oppenheimer",
  "era": "Modern Tarih",
  "region": "ABD",
  "themes": ["Bilim", "Savaş", "Etik"],
  "whatWeSee": "Los Alamos'ta ilk atom bombasının geliştirilmesi ve testi.",
  "realHistory": "Giriş paragrafı...\n\n### Los Alamos\nİkinci bölüm...",
  "accuracyNote": "Film teknik süreçte güçlü; bazı ilişkiler drama için sıkılaştırılmış.",
  "whyInteresting": "Atmosferin tutuşma riski hesaplanmıştı.",
  "misconception": "Bombayı tek bir bilim insanı yaptığı sanılır.",
  "nextTopics": ["Manhattan Projesi", "Soğuk Savaş"],
  "sources": [
    {
      "title": "The Manhattan Project (NPS)",
      "url": "https://www.nps.gov/mapr/learn/historyculture/index.htm",
      "type": "official",
      "verified": true
    }
  ],
  "similarMedia": [],
  "relatedCardIds": [],
  "difficulty": "medium",
  "readingTimeMinutes": 7,
  "verificationStatus": "verified",
  "sourceQuality": "strong",
  "spoilerLevel": "minor",
  "mediaConnection": "Bu kart, Oppenheimer yapımındaki tarihsel anlatıdan yola çıkar.",
  "accuracyType": "partly-real",
  "isPremium": false,
  "tags": ["abd", "bilim", "savas", "oppenheimer"],
  "spoilerNote": "Yapımın kurgusal çerçevesi hakkında detaylar içerir.",
  "mediaChanged": "Filmde bazı ilişkiler sembolik olarak güçlendirilmiştir.",
  "whyItMatters": "Bilim insanının ahlaki sorumluluğu tartışmasını simgeler.",
  "isFlagship": true,
  "quickRealityCheck": "Trinity, insanlığın kendi sonunu tasarlayabildiği çağın başlangıcıydı. Film bunu ne kadar yansıtıyor?"
}
```

---

## 11. Toplu üretim — tek dosyada 200 kart (önerilen iş akışı)

Tek tek kart atmak yerine **hepsini bir JSON dosyasında** üret. Sen dosyayı Cursor’a atarsın; geliştirici script ile uygulamaya ekler.

### Dosya adı ve konum (öneri)

`card-batch-200.json` — nerede olursa olsun (ör. Masaüstü). İçe aktarırken tam yol verilir.

### Tek dosya şeması (zorunlu format)

```json
{
  "meta": {
    "version": 1,
    "task": "200 yeni kart — oyun/film karışık",
    "author": "Üreten AI / tarih",
    "expectedTr": 200,
    "expectedEn": 200,
    "notes": "Opsiyonel: hangi medyalar, flagship oranı vb."
  },
  "batches": [
    { "locale": "tr", "cards": [ /* tam 200 kart nesnesi */ ] },
    { "locale": "en", "cards": [ /* aynı 200 id, İngilizce metin */ ] }
  ]
}
```

| Kural | Açıklama |
|--------|----------|
| **200 TR + 200 EN** | `batches[0].cards.length` ve `batches[1].cards.length` aynı olmalı |
| **Aynı id seti** | Her TR kartının EN karşılığı aynı `id` ile var |
| **id benzersiz** | Aynı batch içinde tekrarlayan id yok |
| **Mevcut id’ler** | Uygulamada zaten ~190 TR / ~166 EN kart var; **yeni id üret**, eskileri kopyalama |
| **Dosya boyutu** | 200 kart ≈ 2–8 MB JSON normal; tek dosya yeterli |
| **contentBlocks** | Yazma — uygulama üretir |

### Dış AI’ye verilecek kısa talimat (kopyala-yapıştır)

```
True Frame içerik rehberini (icerik-uretim-rehberi.md) oku.
Toplam 200 YENİ konu için kart üret: 200 TR + 200 EN, aynı id.
Tek JSON dosyası ver; şema: meta + batches[{locale:"tr",cards:[]},{locale:"en",cards:[]}].
Her kart rehberdeki tüm zorunlu alanları içersin.
quickRealityCheck ve en az 1 gerçek kaynak URL zorunlu.
Flagship oranı yaklaşık %25–30 olabilir, geri kalan standart kart.
Parça parça teslim ETME — tek geçerli JSON dosyası.
Üretim bitince JSON geçerliliğini kontrol et (jsonlint).
```

### Dosya çok büyükse (AI limiti)

Aynı yapıyı koru, `meta` içine ekle:

```json
"part": 1,
"partsTotal": 4,
"idRange": "batch-001 .. batch-050"
```

4 parça üret → sen 4 dosyayı sırayla Cursor’a at → her biri ayrı import edilir.

---

## 12. Geliştiriciye geri verirken (sen → Cursor)

1. **Tek JSON dosyası** (veya parça parça 2–4 dosya)
2. Kısa mesaj örneği:

   > `card-batch-200.json` — 200 yeni kart TR+EN. Uygulamaya import et.

3. Varsa: flagship oranı, hassas konu uyarısı, bilinçli TR-only istisna

### Geliştirici ne yapar (kalite kontrolü dahil)

Dosyayı attığında **önce otomatik QC**, sonra (sen onaylarsan) import:

```bash
# 1) Kalite raporu — uygulamaya YAZMAZ
node scripts/import-card-batch.mjs path/to/card-batch-200.json

# 2) QC temizse import
node scripts/import-card-batch.mjs path/to/card-batch-200.json --write

# 3) Sadece uyarı varsa (hata yok) — bilinçli onay
node scripts/import-card-batch.mjs path/to/card-batch-200.json --write --accept-warnings

# 4) Tüm arşiv denetimi
npm run content:audit
npm run mobile:sync
npm run mobile:check
```

#### Otomatik QC ne kontrol eder?

| Seviye | Örnek | Import |
|--------|--------|--------|
| **Hata (P0)** | Eksik alan, boş `realHistory`, geçersiz URL, TR/EN id uyuşmazlığı, placeholder metin | **Engellenir** |
| **Uyarı (P1)** | Flagship çok kısa, `quickRealityCheck` yok, EN’de Türkçe karakter, `relatedCardId` bulunamıyor | Düzeltmen önerilir; `--accept-warnings` ile geçilebilir |
| **Bilgi (P2)** | `readingTimeMinutes` metne göre uzak | Sadece rapor |

#### Otomatik QC ne kontrol etmez? (insan gözü)

- Tarihsel doğruluk, kaynak gerçekten ilgili mi
- Üslup True Frame’e uyuyor mu (rehber §2)
- Spoiler seviyesi gerçekten doğru mu
- Medya adı / yapım eşlemesi mantıklı mı

Bunlar için import sonrası **5–10 kartı uygulamada okuyarak** spot check yapılır; 200 kartın hepsini tek tek okumak pratik değil — örneklem yeterli.

- Çakışan `id` varsa varsayılan **atlanır**; üzerine yazmak için `--replace`

---

## 13. Konu önerileri (200 kart için)

- TR’de var, EN’de yok: ~25 kart (çeviri işi)
- Popüler medya eksikleri: kullanıcı geri bildirimine göre
- “Yanlış bilinenler” tarzı: `medieval-hygiene`, `viking-horned-helmet` örnekleri

Yeni konu üretirken önce **mevcut `mediaTitle` listesine** bak; aynı dosyaya eklenecek kartlar birbirini tamamlasın.

---

## 14. Kontrol listesi (göndermeden önce)

- [ ] Her kartta en az 1 çalışan kaynak URL’si
- [ ] `quickRealityCheck` dolu (Keşfet önizlemesi)
- [ ] Flagship’lerde `mediaChanged` + `whyItMatters` + çok parçalı `realHistory`
- [ ] TR/EN aynı `id`, aynı `isFlagship`, aynı `mediaType`
- [ ] Spoiler içerikte `spoilerLevel` doğru
- [ ] JSON geçerli (jsonlint veya benzeri)

---

*Belge sürümü: 2026-05 — True Frame mobil uygulama (`data/cards.*.json`).*
