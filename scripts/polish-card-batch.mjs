#!/usr/bin/env node
/**
 * Mekanik polish — AI batch sonrası şablon/tekrar düzeltmeleri.
 *   node scripts/polish-card-batch.mjs docs/incoming/true-frame-card-batch-200-v3.json
 *   node scripts/polish-card-batch.mjs <in.json> --out <out.json>
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const inArg = process.argv.find((a) => a.endsWith(".json") && !a.startsWith("-"));
const outArg = process.argv.includes("--out")
  ? process.argv[process.argv.indexOf("--out") + 1]
  : null;

if (!inArg) {
  console.error("Kullanım: node scripts/polish-card-batch.mjs <batch.json> [--out out.json]");
  process.exit(1);
}

const inPath = path.isAbsolute(inArg) ? inArg : path.join(process.cwd(), inArg);
const outPath = outArg
  ? path.isAbsolute(outArg)
    ? outArg
    : path.join(process.cwd(), outArg)
  : inPath.replace(/\.json$/i, "-polished.json");

const data = JSON.parse(fs.readFileSync(inPath, "utf8"));
const stats = {
  misconceptionDeduped: 0,
  kleopatraParagraphRemoved: 0,
  closureReplaced: 0,
  flagshipMediaChanged: 0,
  bayekPhraseVaried: 0,
  mediaConnectionVaried: 0,
  whyItMattersVaried: 0,
  capitalizationFixed: 0,
};

const KLEOPATRA_PARA =
  /MÖ 1\. yüzyıl boyunca Kleopatra VII, Ptolemaios hanedanı, rahipler ve yazıcılar, Roma iç savaşı ve Ptolemaios iktidar mücadelesi içinde farklı çıkarlarla hareket etti\.\s*[^.\n]+ yalnızca ünlü kişilerin kararıyla açıklanamaz; kayıt tutan kurumlar, yerel topluluklar, askerî baskı ve ekonomik zorunluluklar aynı anda devrededir\.\s*/g;

const CLOSURE_RE =
  /Bu nedenle ([^,]+), ([^.]+)\. ([^.]+) hakkında asıl merak, ekrandaki etkinin arkasında hangi işlerin, kimlerin ve hangi sonuçların kaldığını sormaya başladığında açılır\.\s*/g;

const FLAGSHIP_MC_RE =
  /^Ekran anlatısı .+ için keskin görüntüler seçer ve belirsizliği azaltır\. Kaynaklar ise bu başlığın MÖ 1\. yüzyıl içinde daha yavaş, daha dağınık ve çoğu zaman daha sıradan biçimde işlediğini gösterir\.$/;

const FLAGSHIP_MC_LOOSE = /Ekran anlatısı .+ için keskin görüntüler seçer/;

const FLAGSHIP_MC_EN_RE =
  /^The screen version chooses sharp images for .+ and reduces uncertainty\. The sources show a slower, messier, and often more ordinary process inside .+\.$/;

const WHY_TEMPLATE =
  /^(.+) bu başlığı merak uyandırmak için kullanır; tarihsel bağlam ise o merakı daha sağlam bir zemine taşır\. (.+), büyük olayların sıradan hayatlara nasıl dokunduğunu gösterir\.$/;

const MC_CONN_RE =
  /^Bu kart, (.+) içindeki (.+) anlatısını gerçek tarih bağlamıyla birlikte okur\.$/;

const BAYEK_PHRASE =
  /Bayek'in şehir sokaklarında, tapınak avlularında ve (?:nil|Nil) kıyısında ilerlediği bölümler/g;

function dedupeSentences(text) {
  if (!text || typeof text !== "string") return text;
  const parts = text.split(/(?<=[.!?])\s+/);
  const seen = new Set();
  const out = [];
  for (const part of parts) {
    const key = part.trim().replace(/\s+/g, " ");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(part);
  }
  return out.join(" ");
}

function hashIdx(str, mod) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % mod;
}

const closureVariantsTr = (media, title) => {
  const i = hashIdx(`${media}:${title}`, 5);
  const v = [
    `${media}, ${title} üzerinden merak uyandırır; asıl soru sahnenin hangi kurumları ve emeği görünmez bıraktığıdır.`,
    `${title} için ${media} güçlü bir kapı açar; kaynaklara dönünce meselenin tek bir kahramana indirgenemediği görülür.`,
    `Sahne ${title} konusunu hızlı okunur kılar; tarihsel okuma ise aynı konunun yavaş işleyen kurumlarını geri getirir.`,
    `${media} izlerken ${title} çarpıcı görünür; gerçek tarih aynı başlığı vergi, inanç ve gündelik emekle birlikte okur.`,
    `${title} hakkında asıl derinlik, ekrandaki etki ile arşivlerin anlattığı süreç arasındaki farkta saklıdır.`,
  ];
  return v[i];
};

const flagshipMcEn = (card) => {
  const { title, mediaTitle: m } = card;
  const i = hashIdx(card.id, 5);
  const v = [
    `${m} makes ${title} instantly readable on screen; archives show the same topic unfolding through institutions over years.`,
    `The scene sharpens ${title}; historical records remind us the process was slower and more fragmented.`,
    `${title} is simplified for pacing; in sources it ties to law, labor, faith, and local consequence.`,
    `${m} personalizes ${title}; documents link it to collective decisions and everyday cost.`,
    `Screen rhythm favors ${title}; historical reading follows its long-term effects.`,
  ];
  return v[i];
};

const flagshipMcTr = (card) => {
  const { title, mediaTitle: m } = card;
  const i = hashIdx(card.id, 6);
  const v = [
    `${m}, ${title} konusunu tek bakışta okunur kılar; arşivler ise aynı konunun yıllara yayılan kurumsal yüzünü gösterir.`,
    `Sahne ${title} için net imgeler sunar; kayıtlar sürecin daha yavaş ve parçalı işlediğini hatırlatır.`,
    `${title} ekranda sadeleşir; tarihte ise tapınak, vergi, yazı ve askerî baskı gibi katmanlar birlikte çalışır.`,
    `${m} bu başlığı duygusal bir odakla sunar; gerçek bağlamda ${title} çoğu zaman kurumlar ve sıradan emek üzerinden anlaşılır.`,
    `Yapım ${title} ayrıntısını kişiselleştirir; kaynaklar aynı konunun toplu kararlar ve yerel sonuçlarla şekillendiğini gösterir.`,
    `${title} için sahne ritmi önceliklidir; tarihsel inceleme ise aynı konunun uzun vadeli sonuçlarına bakar.`,
  ];
  return v[i];
};

const bayekAlternatives = [
  "Origins'in İskenderiye ve Faiyum görev akışında",
  "oyunun Mısır haritasındaki şehir ve tapınak bölümlerinde",
  "Bayek'in ana hikâye görevleri sırasında",
  "Nil delta'sı ve çöl kenarı mekânlarında",
  "şehir içi infiltration ve halk görevlerinde",
];

const mcConnVariants = (media, title, id) => {
  const i = hashIdx(id, 4);
  const v = [
    `${media} içindeki ${title} sahneleri, gerçek tarihle yan yana okununca daha anlamlı hale gelir.`,
    `Bu kart, ${title} konusunu ${media} üzerinden tarihsel kayıtlarla karşılaştırır.`,
    `${title}: ${media} atmosferi ile arşivlerin anlattığı düzen arasındaki fark.`,
    `${media} ve ${title} — ekrandaki görüntü ile belgelenmiş gerçeklik.`,
  ];
  return v[i];
};

const whyVariants = (media, title, id) => {
  const i = hashIdx(id, 4);
  const v = [
    `${title}, ${media} izlerken atmosferin ardındaki kurumsal gerçekliği hatırlatır.`,
    `Bu ayrıntı, sahnenin neden yalnızca dekor olmadığını ${title} örneğiyle gösterir.`,
    `${media} merak uyandırır; ${title} ise o merakı belge ve bağlama bağlar.`,
    `${title} üzerinden bakınca geçmişin tek cümleyle özetlenemeyeceği görülür.`,
  ];
  return v[i];
};

function fixCapitalization(text) {
  if (!text) return text;
  // yüzyıl, bce gibi bilerek küçük kalsın
  return text.replace(/([.!?])\s+([a-zçğıöşü])([a-zçğıöşü]*)/g, (full, end, c, rest) => {
    const word = c + rest;
    if (/^(yüzyıl|bce|ce)$/.test(word)) return full;
    stats.capitalizationFixed++;
    const map = { ç: "Ç", ğ: "Ğ", ı: "I", i: "İ", ö: "Ö", ş: "Ş", ü: "Ü" };
    return `${end} ${map[c] || c.toUpperCase()}${rest}`;
  });
}

/** "doğru bir başlangıç hissi verir" içeren paragrafı tamamen değiştir */
function cleanupBrokenClosure(text, card) {
  if (!text || !text.includes("doğru bir başlangıç hissi verir")) return text;
  const rep = closureVariantsTr(card.mediaTitle, card.title);
  const paras = text.split(/\n\n/).map((para) => {
    if (!para.includes("doğru bir başlangıç hissi verir")) return para;
    stats.closureReplaced++;
    return rep;
  });
  return paras
    .join("\n\n")
    .replace(/\s+içinde içinde\s+/g, " içinde ")
    .replace(/MÖ 1\. Yüzyıl/g, "MÖ 1. yüzyıl");
}

function polishCard(card, locale, ctx) {
  const fields = ["misconception", "accuracyNote", "whyInteresting", "quickRealityCheck"];
  for (const f of fields) {
    if (card[f]) {
      const d = dedupeSentences(card[f]);
      if (d !== card[f]) {
        card[f] = d;
        stats.misconceptionDeduped++;
      }
    }
  }

  if (card.realHistory) {
    let rh = card.realHistory.replace(/\bnil kıyısında\b/g, "Nil kıyısında");

    const kleoKey = `${locale}:${card.mediaTitle}:kleopatra`;
    if (KLEOPATRA_PARA.test(rh)) {
      KLEOPATRA_PARA.lastIndex = 0;
      if (ctx.kleopatraSeen.has(kleoKey)) {
        rh = rh.replace(KLEOPATRA_PARA, "");
        stats.kleopatraParagraphRemoved++;
      } else {
        ctx.kleopatraSeen.add(kleoKey);
      }
    }

    if (locale === "tr" && rh.includes("doğru bir başlangıç hissi verir")) {
      rh = rh.replace(CLOSURE_RE, (_, media, _m2, topic) => {
        stats.closureReplaced++;
        return `${closureVariantsTr(media.trim(), topic.trim())} `;
      });
    }

    if (locale === "tr") {
      const bayekKey = card.mediaTitle;
      let count = ctx.bayekCount.get(bayekKey) ?? 0;
      rh = rh.replace(BAYEK_PHRASE, (match) => {
        count++;
        ctx.bayekCount.set(bayekKey, count);
        if (count <= 2) return match;
        stats.bayekPhraseVaried++;
        const alt = bayekAlternatives[hashIdx(card.id, bayekAlternatives.length)];
        return alt;
      });
    }

    rh = cleanupBrokenClosure(rh, card);
    card.realHistory = fixCapitalization(rh.replace(/\n{3,}/g, "\n\n").trim());
  }

  if (card.isFlagship && card.mediaChanged) {
    const mc = card.mediaChanged.trim();
    if (locale === "tr" && (FLAGSHIP_MC_RE.test(mc) || FLAGSHIP_MC_LOOSE.test(mc))) {
      card.mediaChanged = flagshipMcTr(card);
      stats.flagshipMediaChanged++;
    } else if (locale === "en" && (FLAGSHIP_MC_EN_RE.test(mc) || /sharp images for/.test(mc))) {
      card.mediaChanged = flagshipMcEn(card);
      stats.flagshipMediaChanged++;
    }
  }

  if (locale === "tr" && card.mediaConnection) {
    const m = MC_CONN_RE.exec(card.mediaConnection);
    if (m) {
      card.mediaConnection = mcConnVariants(m[1], m[2], card.id);
      stats.mediaConnectionVaried++;
    }
  }

  if (locale === "tr" && card.whyItMatters) {
    const w = WHY_TEMPLATE.exec(card.whyItMatters);
    if (w) {
      card.whyItMatters = whyVariants(w[1], w[2], card.id);
      stats.whyItMattersVaried++;
    }
  }

  if (card.whatWeSee) {
    card.whatWeSee = card.whatWeSee.replace(/\bnil kıyısında\b/g, "Nil kıyısında");
  }
}

const kleopatraSeen = new Set();
const bayekCount = new Map();

for (const batch of data.batches ?? []) {
  const locale = batch.locale;
  const ctx = { kleopatraSeen, bayekCount };
  for (const card of batch.cards ?? []) {
    polishCard(card, locale, ctx);
  }
}

data.meta = {
  ...data.meta,
  version: data.meta?.version ?? 3,
  polish: "scripts/polish-card-batch.mjs",
  notes: [data.meta?.notes, "polish: tekrar cümleler, flagship mediaChanged, AC şablon paragrafları"].filter(Boolean).join(" | "),
};

fs.writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

console.log("── polish-card-batch ──\n");
console.log(`Girdi:  ${inPath}`);
console.log(`Çıktı: ${outPath}\n`);
console.log(stats);
console.log("\nSonraki: node scripts/import-card-batch.mjs", outPath);
