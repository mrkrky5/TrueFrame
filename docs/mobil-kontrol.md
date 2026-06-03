# Mobil smoke test — elle kontrol listesi

Otomatik kontrol (`npm run mobile:check`) yakalar: TypeScript, veri bütünlüğü, eksik ekranlar, production bundle.
Aşağıdaki adımlar ise UI/akış tarafında gözle görülür kırılmaları yakalar.

## Hazırlık

```powershell
npm run mobile:windows
```

(`shared/`, `data/` vb. otomatik `mobile/` altına kopyalanır — Metro monorepo kısıtı.)

Tarayıcıda `http://localhost:8081` açılır. Telefon çerçevesi ortada görünmeli (tam ekran değil).

İlk kurulumu sıfırlamak için:

```powershell
`npm run mobile:windows` her açılışta sıfır kurulum gibi başlar (veri silinir). Veriyi korumak için: `npm run mobile:web`
```

## TestFlight (gerçek iPhone)

Tam regresyon listesi: **[testflight-regression.md](./testflight-regression.md)** — her TestFlight build için.

App Store yayın (build 16): **[app-store-release.md](./app-store-release.md)** · Connect adımları: **[app-store-connect-listing.md](./app-store-connect-listing.md)**.

## 5 dakikalık kontrol

| # | Ne yap | Beklenen |
|---|--------|----------|
| 1 | Ana sayfa açılır | Günlük kart, devam et, rota önizlemesi görünür |
| 2 | Keşfet → arama yaz | Liste filtrelenir, boş sonuç mesajı gelir |
| 3 | Keşfet → ruh hali / tür filtresi | Kart listesi değişir |
| 4 | Flagship kart aç (FLAGSHIP rozeti) | Spoiler kapısı → sayfalı okuyucu → Devam/Geri |
| 5 | Okumayı bitir | Geri dön / Ana sayfa / Keşfet butonları çıkar |
| 6 | Lite kart aç | Kısa okuyucu, flagship sayfalama yok |
| 7 | Kaydet → Kaydedilenler sekmesi | Kart listede görünür |
| 8 | Rotalar → bir rota → kart | Rota detayı ve kart linkleri çalışır |
| 9 | Dil değiştir (varsa) | Metinler EN/TR güncellenir, boş ekran yok |
| 10 | Konsol (F12) | Kırmızı hata yok |

## Otomatik kontrol

```powershell
# Hızlı (~10 sn): tsc + veri + ekran dosyaları
npm run mobile:check

# Tam (~1–2 dk): + production web bundle
npm run mobile:check -- --build

# İçerik dili denetimi
npm run validate:en-content
```

## Bilinen sınırlar

- Okuyucuda inline görseller (bilinçli ertelendi)
- Native iOS EAS build — Windows’ta yalnızca web önizleme; TestFlight Mac/EAS ile
- 25 kart yalnızca TR katalogda (EN çevirisi v1.1)

## Yeni içerik sonrası (isteğe bağlı)

```powershell
npm run content:sync-routes
npm run content:mood-tags
npm run mobile:sync
```

## Bir şey patlarsa

1. Terminalde Metro hata satırına bak (kırmızı `Unable to resolve module`).
2. `npm run mobile:check -- --build` çalıştır — dev çalışıp export'un patlaması sık görülür.
3. `@shared/*` import kullanıldığından emin ol (`mobile/metro.config.js` alias).
