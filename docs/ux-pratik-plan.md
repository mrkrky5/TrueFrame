# UX pratik iyileştirmeler — uygulama planı

**Durum:** Uygulandı (Mayıs 2026)

Bilgi uygulaması odaklı, kısa vadeli UX backlog. Her madde bağımsız PR/sprint dilimine bölünebilir.

**Son güncelleme:** Mayıs 2026

---

## Faz A — Keşfet okunabilirliği (1–2 gün)

### 1. Aramada sonuç önizlemesi
**Ne:** Keşfet listesinde kart başlığının altında `quickRealityCheck` (yoksa kısa `subtitle`) tek satır.

| Dosya | İş |
|-------|-----|
| `mobile/components/HistoryCard.tsx` | Opsiyonel `previewLine` prop veya karttan türet |
| `mobile/app/(tabs)/explore.tsx` | FlatList render’da önizleme açık |
| `lib/dictionaries/*.json` | Gerekirse `explore.previewFallback` yok — mevcut alanlar yeter |

**Kabul:** Arama/filtre sonucunda en az 1 satır “cevap ipucu” görünür; flagship/lite ayrımı gerekmez.

---

### 2. Filtre özeti çubuğu
**Ne:** Keşfet katalog üstünde: `12 sonuç · 8 okunmamış` (veya filtre aktifken `12 sonuç`).

| Dosya | İş |
|-------|-----|
| `shared/explore.ts` veya `explore.tsx` | `filtered` + `readIds` ile unread say |
| `mobile/app/(tabs)/explore.tsx` | `ListHeader` içinde özet satır |
| `lib/dictionaries/*.json` | `explore.resultsSummary`: `{{total}} sonuç · {{unread}} okunmamış` |

**Kabul:** Filtre veya arama varken özet görünür; sayılar listeyle tutarlı.

---

### 8. Boş arama önerileri
**Ne:** Sonuç 0 iken 3 chip: örnek arama / mood (ör. “Viking”, “mit”, “savaş”).

| Dosya | İş |
|-------|-----|
| `shared/exploreCurated.ts` | `getExploreSearchSuggestions(locale)` — mood tag’lerden veya sabit liste |
| `mobile/app/(tabs)/explore.tsx` | `ListEmptyComponent` genişlet |
| `lib/dictionaries/*.json` | `explore.emptySearchTitle`, chip etiketleri |

**Kabul:** Boş sonuç ekranında en az 3 tıklanabilir öneri; tıklayınca arama/filtre dolar.

---

### 9. Spoiler filtresi hızlı chip
**Ne:** Keşfet arama altında tek chip: “Spoiler yok” → `spoilerLevel === 'none'` veya lite kartlar.

| Dosya | İş |
|-------|-----|
| `shared/explore.ts` | `filterCards` içine `spoilerFree?: boolean` |
| `mobile/app/(tabs)/explore.tsx` | Hızlı chip satırı (mood grid üstü/altı) |
| `lib/dictionaries/*.json` | `explore.spoilerFreeFilter` |

**Kabul:** Chip açık/kapalı; liste sadece spoiler’sız kartları gösterir.

---

## Faz B — İlerleme ve yön (1 gün)

### 3. Okuyucuda “X dk kaldı”
**Ne:** Flagship üst progress alanında: `~4 dk kaldı` (kalan blok × ortalama süre veya `readingTimeMinutes` × kalan %).

| Dosya | İş |
|-------|-----|
| `mobile/components/GuidedJourneyReader.tsx` | `progressLabel` yanına kalan süre |
| `shared/contentBlocks.ts` veya reader | Blok başına sabit ~45 sn veya kart `readingTimeMinutes` dağıtımı |
| `lib/dictionaries/*.json` | `common.minutesLeft`: `~{{count}} dk kaldı` |

**Kabul:** Flagship okurken step değiştikçe kalan süre güncellenir.

---

### 5. Rota detayda sıradaki kart
**Ne:** Rota sayfası en üstte tek CTA: bir sonraki okunmamış kart.

| Dosya | İş |
|-------|-----|
| `mobile/app/(tabs)/route/[id].tsx` | `readIds` ile `nextUnread` bul; mevcut partial CTA güçlendir |
| `shared/homeProgress.ts` veya küçük helper | `getNextUnreadInRoute(route, cards, readIds)` |
| `lib/dictionaries/*.json` | `routes.nextCard`: `Sıradaki: {{title}}` |

**Kabul:** Yarım rotada açılışta net “sıradaki kart” butonu; tamamlanan rotada gösterilmez.

---

### 6. Dosyada okunmayan sayısı
**Ne:** Keşfet dossier kartlarında badge: `3/5 kaldı`.

| Dosya | İş |
|-------|-----|
| `mobile/app/(tabs)/explore.tsx` | `strongDossiers` map’te `readIds` ile progress |
| `mobile/utils/formatDossierMeta.ts` | Opsiyonel `formatDossierRemaining(d, readIds)` |
| `lib/dictionaries/*.json` | `explore.dossierRemaining`: `{{left}}/{{total}} kaldı` |

**Kabul:** En az 1 kart okunmuş dosyada kalan sayı görünür; hiç okunmamışsa sadece mevcut meta.

---

## Faz C — Liste tutarlılığı (½–1 gün)

### 4. Kaydedilenlerde okundu/okunmadı
**Ne:** Kitaplık sekmesinde aynı kural: okunmamış üstte, okunan soluk/altta.

| Dosya | İş |
|-------|-----|
| `mobile/app/(tabs)/saved.tsx` | `sortCardsByReadState` + `HistoryCard isRead` |
| Mevcut | `shared/cardSort.ts` zaten var |

**Kabul:** Kaydedilenler listesi Keşfet ile aynı görsel dil.

---

### 10. Son okunan — sadeleştirme
**Ne:** Ana sayfa “Son görülen” en fazla 1 kart + “Tümünü gör” (Kitaplık veya Keşfet).

| Dosya | İş |
|-------|-----|
| `mobile/app/(tabs)/index.tsx` | `continueItems.slice(0, 1)` + link |
| `lib/dictionaries/*.json` | `home.seeAllRecent` |

**Kabul:** Ana sayfa kalabalık değil; çoklu devam varsa tek kart + link.

---

## Faz D — Teknik polish (1 gün)

### 7. Geri dönüşte scroll koruma
**Ne:** Keşfet’ten kart okuyup dönünce liste scroll pozisyonu korunur.

| Dosya | İş |
|-------|-----|
| `mobile/context/NavigationContext.tsx` veya yeni `ExploreScrollContext` | `exploreScrollY` + `FlatList ref` |
| `mobile/app/(tabs)/explore.tsx` | `onScroll` persist; `useFocusEffect` restore |
| `mobile/app/(tabs)/card/[id].tsx` | Dönüşte tab explore ise scroll geri yükle |

**Kabul:** Uzun katalogda kart aç/kapa sonrası kullanıcı aynı bölgede kalır (web + native).

**Not:** Web’de FlatList ref + `scrollToOffset`; test `mobile:windows`.

---

## Önerilen sıra

```
A1 → A2 → A4 (saved) → B5 → B6 → B3 → A8 → A9 → C10 → D7
```

| Sıra | Madde | Neden |
|------|-------|--------|
| 1 | 2 Filtre özeti | Düşük risk, Keşfet’e hemen değer |
| 2 | 1 Arama önizlemesi | Bilgi app hissi |
| 3 | 4 Kaydedilenler sıra | Mevcut `cardSort` reuse |
| 4 | 5 Rota sıradaki | Ana sayfa “kaldığın yerden” ile uyum |
| 5 | 6 Dosya kalan | Keşfet dossier satırı |
| 6 | 3 dk kaldı | Okuyucu polish |
| 7 | 8 Boş arama | Keşfet empty state |
| 8 | 9 Spoiler chip | Hızlı filtre |
| 9 | 10 Son okunan sade | Ana sayfa sadeleşme |
| 10 | 7 Scroll koruma | En teknik; sona |

---

## Ortak altyapı (zaten var / eklenecek)

- `readIds` → `useHistory()`
- `sortCardsByReadState` → `shared/cardSort.ts`
- `flattenStyle` → Link+asChild (web Slot hatası)
- Sözlük → `npm run mobile:sync` sonrası `mobile/lib/dictionaries`

---

## Test checklist (her faz sonrası)

```powershell
npm run mobile:sync
npm run mobile:check
npm run mobile:windows
```

- Keşfet: arama, filtre, dossier badge, scroll (Faz D)
- Ana sayfa: kaldığın yerden + tek son okunan
- Rota: sıradaki kart CTA
- Flagship: kalan dk
- Kitaplık: okunan soluk/altta
- Konsol: Slot/style hatası yok
