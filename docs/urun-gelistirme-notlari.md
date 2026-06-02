# Ürün geliştirme notları (kenar)

Onaylanmış fikirler — henüz implementasyon yok. Release checklist değil; ürün UX backlog.

**Son güncelleme:** Mayıs 2026

---

## 1. Okunan içerik listede geride / soluk

**Ne:** Okunmuş kartlar Ana Sayfa ve Keşfet listelerinde üstte durmasın. Altta kalsın veya soluk görünsün (✓ / “Tekrar oku”).

**Neden:** Üstte “henüz bakmadıklarım”, altta “bunu okudum” — katalog değil, açık kalan konular öne çıkar.

**Durum:** Uygulandı (Mayıs 2026).

**Uygulama:** `shared/cardSort.ts`, `HistoryCard` / Keşfet katalog sıralaması, Start here solukluk.

---

## 2. Aynı konuyu anlatan kartlar — akıllı gruplama

**Ne:** Bir kart bitince veya listede: “Bu konuyla ilgili X kart daha” — ilgili kartlar bir arada gösterilsin.

**Neden:** Tek okuma yetmez; aynı mit/konu farklı medyada tekrar eder. Wikipedia “ilgili maddeler” mantığı.

**Durum:** Uygulandı (Mayıs 2026).

**Uygulama:** `shared/relatedCards.ts`, `RelatedTopicCards`, okuma sonu; duplicate denetimi: `node scripts/audit-related-overlap.mjs`.

---

## 3. Yarım kalan rota / dosya — Ana Sayfa

**Ne:** Ana sayfada net blok: “Oyunlardan Gerçeğe — 4/27”, “Assassin’s Creed dosyası — 1/5” gibi yarım kalan rotalar ve medya dosyaları.

**Neden:** “Ne okuyayım?” sorusuna somut cevap; rastgele katalog karıştırmayı azaltır.

**Durum:** Uygulandı (Mayıs 2026).

**Uygulama:** `shared/homeProgress.ts`, Ana Sayfa “Kaldığın yerden” bloğu (rota + dosya, en fazla 3).

---

## Sıra önerisi (implementasyon)

1. **§1** — okundu hiyerarşisi (temel, diğerlerine zemin)
2. **§3** — ana sayfa yarım rota/dosya
3. **§2** — önce duplicate denetimi, sonra akıllı “ilgili kartlar”
