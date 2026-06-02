# True Frame — 200 kart revizyon prompt’u

Aşağıdaki metni **tek parça** olarak AI’ya yapıştır. Girdi olarak mevcut `true-frame-card-batch-200.json` dosyasını ekle.

---

## Kopyala-yapıştır prompt

```
Sen True Frame uygulaması için içerik editörüsün. Sana verilen JSON dosyasını REVİZE et — yeni id üretme, mevcut tf26-* id’leri ve TR/EN çift yapısını koru.

## Çıktı
- Tek geçerli JSON: aynı kök yapı (meta + batches[tr, en])
- meta.version = 2, meta.notes içine "revizyon: şablon kaldırıldı" yaz
- Parça parça teslim etme

## Zorunlu düzeltmeler (her kart)

1. **Şablon yasağı**
   - Aynı yapım grubundaki kartlarda (ör. 10’lu AC Mısır bloğu) ortak giriş paragrafı KULLANMA.
   - İki kartın realHistory’si yan yana okununca %30’dan fazla kelime örtüşmesi olmasın.
   - "Bu başlığı bu büyük resmi daha somut hale getirir: mesele, …" kalıbını tamamen kaldır.

2. **realHistory**
   - Standart kart (isFlagship: false): 150–280 kelime TR; EN eşdeğeri.
   - Somut tarih, isim, yer, tarih aralığı; en az bir medya sahnesi ile gerçek olay bağlantısı.
   - Flagship (isFlagship: true): en az 400 kelime TR; EN eşdeğeri.
   - Flagship’te en az 2 bölüm: paragraflar arası \n\n ve \n\n### Bölüm Başlığı\n (Türkçe/İngilizce uygun başlık).

3. **readingTimeMinutes**
   - Metin uzunluğuna göre: ~180 kelime = 1 dk.
   - Standart: 3–6; flagship: 6–12. 8 yazıp 120 kelime bırakma.

4. **Kaynaklar (sources)**
   - Her kartta en az 1 kaynak, konuya özel https URL (Britannica genel “Ancient Egypt” gibi üst sayfa tek başına yeterli değil).
   - Mümkünse 2 kaynak: müze, üniversite, resmi arşiv veya konuya özel Britannica maddesi.
   - title alanı gerçek sayfa başlığı; verified: true sadece URL gerçekten ilgiliyse.

5. **Özgün alanlar** (kart başına farklı olsun)
   - subtitle: "X arkasındaki gerçek bağlam" tekrarını kaldır; merak uyandıran 4–12 kelime
   - whatWeSee: yapımdaki somut sahne/öğe (1–2 cümle)
   - accuracyNote: bu kartın iddiasına özel (genel "atmosfer güçlü" cümlesi kopyalama)
   - quickRealityCheck: soru cümlesi; medya adı geçsin
   - misconception: bu konuya özel yanlış inanış

6. **Medya eşlemesi**
   - mediaTitle doğru yapım olsun (mümkünse alt oyun: Assassin's Creed Origins, Odyssey vb. — konuya uygunsa)
   - Kart sadece o yapımda anlamlı değilse mediaTitle değiştirme; ama metin o yapıma referans versin

## Koru (değiştirme)
- id, relatedCardIds (tf26-*), themes, tags (gerekirse 1–2 ekle), difficulty, spoilerLevel, accuracyType, verificationStatus, sourceQuality
- TR/EN: aynı id, aynı isFlagship, aynı mediaType, aynı spoilerLevel, aynı accuracyType
- 200 TR + 200 EN kart sayısı

## Flagship (50 kart)
- isFlagship: true olanları gerçekten uzat; kısa bırakacaksan isFlagship: false yap (TR ve EN birlikte).
- mediaChanged ve whyItMatters flagship’lerde dolu ve bu konuya özel kalsın.
- contentBlocks ekleme — uygulama realHistory’den böler.

## Ton
- Türkçe: akıcı, meraklı, belgesel anlatıcı; "sen" veya nötr; ders kitabı değil
- İngilizce: doğal EN; ğ, ı, ş, İ yok
- Kesin bilinmeyeni accuracyNote’ta yumuşat

## Kendi kontrolün (çıktıdan önce)
- [ ] 200×2 kart
- [ ] Şablon paragraf yok
- [ ] Flagship ≥400 kelime TR ve ### var
- [ ] readingTime metinle uyumlu
- [ ] Her kart konuya özel kaynak
- [ ] JSON parse edilebilir

Sadece revize JSON döndür; açıklama yazma.
```

---

## Kullanım notları

| Adım | Ne yap |
|------|--------|
| 1 | ChatGPT / Claude’a yukarıdaki prompt + `true-frame-card-batch-200.json` |
| 2 | Çıktıyı `docs/incoming/true-frame-card-batch-200-v2.json` olarak kaydet |
| 3 | `node scripts/import-card-batch.mjs docs/incoming/true-frame-card-batch-200-v2.json` |
| 4 | Uyarı azaldıysa ve örnek 5 kart okunduysa `--write` |

**Son tur (v2 → v3, import öncesi):** `card-batch-final-polish-prompt.md`

Tam üretim rehberi: `docs/icerik-uretim-rehberi.md`
