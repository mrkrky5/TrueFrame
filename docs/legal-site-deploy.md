# Yasal statik sayfalar (GitHub Pages)

**Vercel şart değil.** Push → GitHub Actions → Pages URL.

Uygulama içi ekranlar Connect için yeterli değil; Apple **https** web linki ister. Bu sayfalar aynı repoda: `legal-site/public/`.

---

## 1) GitHub’da Pages’i aç (bir kez)

1. Repo → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. `main` (veya `master`) branch’ine push et

İlk deploy: **Actions** sekmesi → **Deploy legal site** workflow yeşil olmalı.

---

## 2) Push

```powershell
cd C:\Users\Emre\Desktop\Tarih
git add legal-site .github/workflows/deploy-legal-pages.yml docs/legal-site-deploy.md
git commit -m "docs: legal static pages for App Store URLs"
git push origin main
```

(Mac repo farklıysa aynı dosyaları oraya da al.)

---

## 3) Linkleri nereden alırsın?

### A) Geçici — GitHub Pages (repo adı `TrueFrame` ise)

**Türkçe**

```
https://mrkrky5.github.io/TrueFrame/tr/privacy/
https://mrkrky5.github.io/TrueFrame/tr/support/
https://mrkrky5.github.io/TrueFrame/tr/terms/
```

**English**

```
https://mrkrky5.github.io/TrueFrame/en/privacy/
https://mrkrky5.github.io/TrueFrame/en/support/
https://mrkrky5.github.io/TrueFrame/en/terms/
```

`KULLANICI_ADIN` = GitHub kullanıcı adın. Actions deploy bitince **Settings → Pages** altında **Visit site** linki de çıkar.

Connect / App Privacy’de **geçici** bu URL’leri kullanabilirsin (sonunda `/` ile dene; Apple genelde kabul eder).

### B) Kalıcı — `trueframe.app` (önerilen)

`trueframe.app` sende ise:

1. **Settings → Pages → Custom domain** → `trueframe.app`
2. Domain sağlayıcında DNS (GitHub’ın gösterdiği `A` / `CNAME` kayıtları)
3. SSL yeşil olunca:

```
https://trueframe.app/tr/privacy/
https://trueframe.app/tr/support/
https://trueframe.app/tr/terms/
```

`lib/site-brand.ts` zaten `https://trueframe.app/tr/...` üretir — DNS GitHub Pages’e işaret edince kod değişmeden uyumlu olur.

**Not:** Domain şu an başka bir siteye gidiyorsa DNS’i GitHub Pages’e çevirmen gerekir; sadece push yetmez.

---

## Yerel önizleme

```powershell
npm run legal:preview
```

`http://localhost:3000/tr/privacy/` (klasör yapısı `index.html` ile)

---

## Dosya yapısı

```
legal-site/public/
  styles.css
  tr/privacy/index.html
  tr/support/index.html
  tr/terms/index.html
```

---

## Vercel?

İsteğe bağlı alternatif. GitHub Pages yeterliyse Vercel hesabı açmana gerek yok.

---

## App Store Connect — hangi URL nereye?

| Connect alanı | Turkish lokalizasyon | English (U.S.) |
|---------------|----------------------|----------------|
| App Privacy → Privacy Policy URL | `…/tr/privacy/` | `…/en/privacy/` (veya aynı TR) |
| 1.0.0 → Support URL | `…/tr/support/` | `…/en/support/` |
| App Information → Privacy / Support | TR linkler | EN linkler |

**App Privacy** tek alan ise: `…/en/privacy/` (inceleme için) veya TR — ikisi de kabul edilir.

## Connect checklist

- [ ] TR ve EN sayfalar tarayıcıda açılıyor
- [ ] App Privacy → Privacy Policy URL
- [ ] 1.0.0 → Support URL (dile göre)
- [ ] App Information URL’leri

E-posta kutusu (`contact@`) sonra aktif olabilir; sayfada adres durabilir.
