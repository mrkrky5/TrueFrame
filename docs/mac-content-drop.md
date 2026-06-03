# Windows → Mac aktarım (kolay yol)

Tek tek dosya seçmek yerine **hazır zip** kullanın. Mac’teki Expo / EAS / `ios/` / `node_modules` kurulumuna dokunulmaz.

## Varsayılan paket (`npm run pack:mac`)

| Dahil | Açıklama |
|--------|-----------|
| `data/` | Kartlar, rotalar |
| `lib/dictionaries/` | TR/EN UI metinleri |
| **Swipe 7 dosya** | Kart okuyucuyu tab dışına alan fix (daha önce Mac’e gitmemişti) |
| `MAC-DELETE.txt` + `mac-delete.sh` | Mac’te silinecek **3 eski dosya** |

### Swipe — kopyalanan 7 dosya

1. `mobile/app/_layout.tsx`
2. `mobile/app/(tabs)/_layout.tsx`
3. `mobile/app/card/_layout.tsx` *(yeni)*
4. `mobile/app/card/[id].tsx` *(yeni)*
5. `mobile/hooks/useOpenCard.ts`
6. `mobile/components/HistoryCard.tsx`
7. `mobile/components/CardRow.tsx`

### Mac’te silinecek 3 dosya (zip açınca)

1. `mobile/app/(tabs)/card/[id].tsx`
2. `mobile/app/(tabs)/card/_layout.tsx`
3. `mobile/hooks/useReaderGestureBack.ts`

İçi boşsa: `mobile/app/(tabs)/card/` klasörünü de sil.

Liste kaynağı: `data/mac-drop-manifest.json`

## Tam proje zip (replace sorunu varsa)

```powershell
npm run pack:mac:project
```

`dist/trueframe-mac-project-YYYY-MM-DD.zip` — kaynak kod + `data/` + `mobile/` ( **`node_modules`, `ios`, `.env` yok** ).

Mac’te en temiz yol: eski klasörü `Tarih-backup` diye taşı → zip’i **yeni boş** `Tarih/` içine aç → yedekten sadece `mobile/ios` ve `.env` kopyala → `npm install` → `eas build`.

Ayrıntı zip içindeki `MAC-FULL-UNPACK.txt`.

## Diğer profiller

| Komut | İçerik |
|--------|--------|
| `npm run pack:mac` | data + sözlük + swipe 7 + silme scripti **(önerilen)** |
| `npm run pack:mac:content` | Sadece data + sözlük |
| `npm run pack:mac:release` | Yukarı + **tüm** `mobile/` kaynak (app, components, hooks, …) |
| `node scripts/pack-mac-drop.mjs --code --mobile` | release + `shared/`, `types/`, `lib/*.ts` |

**Zip’te asla yok:** `node_modules`, `mobile/.expo`, `mobile/ios`, `.env`

## Windows

```powershell
cd C:\Users\Emre\Desktop\Tarih
npm run pack:mac
# dist/trueframe-mac-swipe-YYYY-MM-DD.zip
```

AirDrop / Drive ile Mac’e at.

## Mac (mevcut klonun üzerine)

```bash
cd ~/path/to/Tarih

unzip -o ~/Downloads/trueframe-mac-swipe-*.zip

chmod +x mac-delete.sh
./mac-delete.sh

npm run mobile:sync
cd mobile
npx eas build -p ios --profile production
```

`mac-delete.sh` atlanırsa eski `(tabs)/card` route’ları kalır → swipe-back / navigasyon bozulabilir.

## Kurulumu neden bozmaz?

- Mac’te bir kez yapılanlar **yerelde kalır**: `node_modules`, `.expo`, `ios/`, Apple imzalama, `eas login`
- Zip yalnızca kaynak + veri günceller

## Git (varsa)

`git pull` + `mac-delete.sh` (bir kez) + `mobile:sync` — zip gerekmez.

## Ters tırnak / WhatsApp

Kodu sohbete yapıştırma — **zip veya dosya** olarak taşı. `npm run pack:mac` backtick’leri korur.

## Sık hata

| Sorun | Çözüm |
|--------|--------|
| Build’de `href={/routes/` hatası | 7 dosyayı zip’ten kopyala; chat’ten yapıştırma |
| Swipe çalışmıyor | `mac-delete.sh` çalıştırıldı mı? |
| Eski kartlar | `npm run mobile:sync` |
