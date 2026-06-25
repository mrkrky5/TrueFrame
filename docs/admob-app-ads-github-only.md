# AdMob app-ads.txt — domain yok, sadece GitHub Pages

`trueframe.app` satın alınmadıysa DNS adımı **yok**. AdMob, App Store’daki **developer website alan adının kökünde** `app-ads.txt` ister.

| URL | AdMob için |
|-----|------------|
| `https://mrkrky5.github.io/TrueFrame/app-ads.txt` | ❌ Alt klasör — kabul edilmez |
| `https://mrkrky5.github.io/app-ads.txt` | ✅ Kök — doğru |

`TrueFrame` reposu **proje sitesi** (`…/TrueFrame/`). Kök dosya için ayrı repo gerekir: **`mrkrky5.github.io`**.

---

## Adım 1 — Yeni GitHub repo (5 dk)

1. [github.com/new](https://github.com/new)
2. **Repository name:** tam olarak `mrkrky5.github.io` (kullanıcı adınla aynı)
3. **Public**
4. README ekle (isteğe bağlı) → Create

---

## Adım 2 — Dosyaları yükle

Bu repodaki şablonu kopyala: `github-user-site/` klasörü

En azından köke şunu koy:

**`app-ads.txt`** (tek satır, başka hiçbir şey yok):

```
google.com, pub-1571569580384263, DIRECT, f08c47fec0942fa0
```

GitHub web arayüzü: repo → **Add file** → **Upload files** → `app-ads.txt` sürükle → Commit.

---

## Adım 3 — Pages açık mı?

`mrkrky5.github.io` repo → **Settings → Pages**

- Source: **Deploy from a branch**
- Branch: **main** / **root** → Save

Birkaç dakika sonra tarayıcıda:

**https://mrkrky5.github.io/app-ads.txt**

Sadece o tek satır görünmeli (HTML sayfası değil).

---

## Adım 4 — App Store Connect URL’leri

AdMob, mağazadaki **developer website domain** ile eşleştirir.

**App Store Connect** → uygulama → **App Information** (ve gerekirse 1.0.0):

| Alan | Değer |
|------|--------|
| **Developer Website** | `https://mrkrky5.github.io` |
| **Privacy Policy URL** | `https://mrkrky5.github.io/TrueFrame/en/privacy/` *(TrueFrame repo Pages)* |
| **Support URL** (sürüm) | `https://mrkrky5.github.io/TrueFrame/en/support/` |

Developer Website **mutlaka** `mrkrky5.github.io` kökü olsun (app-ads.txt ile aynı host).

`trueframe.app` geçen eski URL’ler varsa güncelle — o domain sana ait değil.

---

## Adım 5 — AdMob

AdMob → **True Frame Media (iOS)** → app-ads.txt → **Check for updates** / doğrula.

- İlk tarama: dakikalar
- Bazen 24–48 saat

---

## Özet

```
TrueFrame repo     →  mrkrky5.github.io/TrueFrame/…  (privacy, support)
mrkrky5.github.io repo  →  mrkrky5.github.io/app-ads.txt  (AdMob kök dosya)
```

İki repo, ücretsiz, custom domain gerekmez.
