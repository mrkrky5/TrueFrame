# Web → Mobil taşıma denetimi

Son güncelleme: migration sonrası parity kontrolü.

## Özet

| Alan | Durum | Not |
|------|-------|-----|
| Ana sayfa | ✅ Taşındı | Günlük kart, devam et, rota önizlemesi |
| Keşfet | ✅ Taşındı | Arama, filtreler, ruh hali, dossier linkleri, “Filtreyi Temizle” |
| Rotalar + detay | ✅ Taşındı | Orphan kart id’leri düzeltildi |
| Kaydedilenler | ✅ Taşındı | |
| Kart okuyucu (lite) | ✅ Taşındı | Spoiler kapısı, reflection |
| Flagship okuyucu | ✅ Taşındı | Sayfalama, tahmin, reflection, tamamlama |
| Medya dossier (`/media/[slug]`) | ✅ Taşındı | İlerleme, önerilen kart, ilgili dosyalar |
| Onboarding | ✅ Taşındı | |
| i18n EN | ✅ | TR/EN sözlük + `LanguagePicker`; EN katalog ~366 kart |
| Gizlilik / Şartlar / Destek | ✅ | `app/privacy.tsx`, `terms.tsx`, `support.tsx`, Ayarlar linkleri |
| Inline okuyucu görselleri | ⏸️ Bilinçli ertelendi | Kullanıcı önceliği dışı |
| Paylaşım butonu (dossier) | ✅ | `DossierShareButton` + native Share |
| Eksik medya talebi | ✅ | `MissingMediaRequest` — Keşfet altı + mailto |
| Keşfet mood filtreleri | ✅ | `shared/moodTags.ts` alias eşlemesi |

## Veri (data)

| Kaynak | Durum |
|--------|-------|
| `data/cards.tr.json` | ✅ Mobil ile aynı (sync) |
| `data/cards.en.json` | ✅ Mobil ile aynı |
| `data/routes.*.json` | ✅ Orphan id’ler canonical id’lere map edildi |
| `shared/` | ✅ Tek kaynak; `@shared` alias |
| Kart alias’ları | ✅ `shared/cardAliases.ts` |

### Orphan rota sorunu (çözüldü)

Rotalarda **eski kart id’leri** vardı (kartlar yeniden adlandırılmış / birleştirilmiş). Örnek:

- `horn-helm-myth` → `viking-horned-helmet`
- `medieval-hygiene-myth` → `medieval-hygiene`
- `shogun-real-shinobi` → `shogun2-shinobi`

Kart verisi silinmemişti; rota dosyaları güncellenmemişti. `scripts/fix-route-ids.mjs` ile düzeltildi.

## Eski web’i silmeden önce

1. `npm run mobile:check -- --build` — geçmeli
2. Elle smoke test: [mobil-kontrol.md](./mobil-kontrol.md)
3. Aşağıdakiler bilinçli kabul edilecekse `app/` (Next.js) silinebilir:
   - Gizlilik/şartlar sayfaları yok
   - EN dil seçici yok
   - Okuyucu inline görselleri yok

## Silinecek legacy (Faz 5)

```
app/                    # Next.js pages
components/             # Web-only UI (mobile/components ayrı)
capacitor.config.*
scripts/build-app.mjs
scripts/serve-out.mjs
```

**Saklanacak:** `data/`, `shared/`, `types/`, `lib/dictionaries/`, `lib/i18n-config.ts`, `mobile/`
