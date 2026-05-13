const fs = require('fs');
const path = require('path');

const cards = JSON.parse(fs.readFileSync('data/cards.json', 'utf8'));

const newCards = [
  {
    "id": "civ-great-library-alexandria-real",
    "title": "İskenderiye Kütüphanesi: Bilginin Kaybı mı?",
    "subtitle": "Tek bir yangın her şeyi bitirdi mi?",
    "mediaType": "game",
    "mediaTitle": "Civilization",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Antik Çağ", "Bilim", "Mısır"],
    "isFlagship": false,
    "accuracyType": "partly-real",
    "spoilerLevel": "none",
    "tags": ["civilization", "iskenderiye-kutuphanesi", "antik-yunan", "misir"],
    "quickRealityCheck": "Civilization oyununda 'Great Library' inşa edildiğinde size devasa bir teknoloji avantajı sağlar; ancak gerçekte bu kütüphanenin yok olması tek bir gecelik bir yangından ziyade, yüzyıllar süren bir ihmal ve bütçe kesintisi sürecidir.",
    "mediaChanged": "Popüler kültürde kütüphane sanki Sezar'ın yangınıyla bir anda yok olmuş ve insanlık 1000 yıl geri gitmiş gibi sunulur. Gerçekte ise kütüphane birçok kez hasar görmüş ve asıl yıkımı ekonomik çöküş getirmiştir.",
    "realHistory": "MÖ 3. yüzyılda kurulan İskenderiye Kütüphanesi, antik dünyanın en büyük bilgi merkeziydi. Ancak bilinenin aksine, kütüphane tek bir büyük felaketle yok olmadı. Jül Sezar'ın kuşatması (MÖ 48) sırasında bir kısmı yandı, ancak asıl çöküş MS 3. ve 4. yüzyıllarda Roma İmparatorluğu'nun ekonomik krize girmesiyle yaşandı. Devlet desteği kesilince bilginler şehri terk etti ve parşömenler bakımsızlıktan çürüdü. Yani bilginin kaybı, bir 'barbar saldırısından' çok, bir medeniyetin artık bilime yatırım yapmayı bırakmasıyla ilgilidir. Yine de burada yapılan çalışmalar (Eratosthenes'in Dünya'nın çevresini ölçmesi gibi) modern bilimin temelini atmıştır.",
    "whyItMatters": "İskenderiye Kütüphanesi'nin hikayesi, bilginin korunmasının sadece binalarla değil, sürekli bir kurumsal iradeyle mümkün olduğunu gösterir.",
    "sources": [
      { "title": "Library of Alexandria (Britannica)", "url": "https://www.britannica.com/topic/Library-of-Alexandria", "type": "official" },
      { "title": "The Destruction of the Great Library (World History Encyclopedia)", "url": "https://www.worldhistory.org/article/207/the-destruction-of-the-great-library-of-alexandria/", "type": "academic" }
    ]
  },
  {
    "id": "total-war-medieval-diplomacy-real",
    "title": "Orta Çağ Diplomasisi: Evlilik ve Kan",
    "subtitle": "Kız alıp vererek barış sağlamak.",
    "mediaType": "game",
    "mediaTitle": "Total War",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Orta Çağ", "Siyaset", "Avrupa Tarihi"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["total-war", "diplomasi", "orta-a", "siyaset"],
    "quickRealityCheck": "Total War oyunlarında diplomasi genellikle bir 'puan' sistemidir; ancak gerçek Orta Çağ'da diplomasi tamamen aile bağları, stratejik evlilikler ve 'çeyiz' olarak verilen topraklar üzerine kurulu devasa bir akrabalık ağıydı.",
    "mediaChanged": "Oyunlarda bir krallıkla dost olmak için para vermeniz yeterlidir. Gerçekte ise en güçlü ittifaklar, iki hanedan arasında kurulan ve geri dönüşü olmayan evlilik bağlarıyla mühürlenirdi.",
    "realHistory": "Orta Çağ Avrupa'sında dış politika 'kişiseldi'. Bir kralın başka bir kralla yaptığı anlaşma, aslında iki ailenin birleşmesi demekti. Prensesler, ülkeleri arasındaki barışın 'teminatı' (peace-weavers) olarak uzak diyarlara gönderilirdi. Bu evlilikler sadece barış değil, aynı zamanda gelecekteki taht haklarını da belirlerdi. Örneğin, İngiltere ve Fransa arasındaki Yüzyıl Savaşları'nın temelinde, İngiliz krallarının Fransız prenseslerle evlenmesi sonucu Fransa tahtında hak iddia etmesi yatar. Diplomasi, ordulardan çok soy ağaçlarıyla yürütülen bir savaştı. Elçiler ise sadece mesaj taşıyan postacılar değil, bu karmaşık aile hukukunu yöneten hukuk uzmanlarıydı.",
    "whyItMatters": "Orta Çağ diplomasisi, modern 'ulus devlet' kavramından önce siyasetin ne kadar kişisel ve ailesel bir yapıya sahip olduğunu gösterir.",
    "sources": [
      { "title": "Medieval Diplomacy (Britannica)", "url": "https://www.britannica.com/topic/diplomacy/Medieval-diplomacy", "type": "official" },
      { "title": "Dynastic Marriage in the Middle Ages (Oxford Academic)", "url": "https://academic.oup.com/book/5615", "type": "academic" }
    ]
  },
  {
    "id": "saving-private-ryan-snipers-reality",
    "title": "Keskin Nişancı Gerçeği vs. Er Ryan",
    "subtitle": "Jackson’ın kulesinden gerçek savaş alanına.",
    "mediaType": "film",
    "mediaTitle": "Saving Private Ryan",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["II. Dünya Savaşı", "Savaş", "Askeri Tarih"],
    "isFlagship": false,
    "accuracyType": "partly-real",
    "spoilerLevel": "minor",
    "tags": ["saving-private-ryan", "keskin-nisanci", "sava", "i-dunya-savasi"],
    "quickRealityCheck": "Er Ryan'ı Kurtarmak filmindeki keskin nişancı Jackson'ın dürbün içinden rakibini vurma sahnesi teorik olarak mümkün olsa da, gerçek II. Dünya Savaşı keskin nişancılığı bir 'şovdan' ziyade gizlenme, sabır ve psikolojik yıpratma üzerine kuruluydu.",
    "mediaChanged": "Film nişancıyı bir 'süper kahraman' gibi gösterir. Gerçekte bir keskin nişancının asıl gücü, yerinin asla tespit edilememesi ve tek bir kurşunla tüm bir birliği durdurabilmesinden geliyordu.",
    "realHistory": "II. Dünya Savaşı'nda keskin nişancılar (sniper), sadece birer iyi atıcı değil, 'görünmez' olma uzmanlarıydı. Filmdeki Jackson gibi bir çan kulesinde sabit beklemek aslında bir intihardır; çünkü yeriniz tespit edildiği an topçu ateşiyle yok edilirsiniz. Gerçek nişancılar çalıların arasında, yıkıntıların içinde günlerce hareketsiz beklerdi. En meşhur nişancı olan Simo Häyhä (Beyaz Ölüm), dürbün kullanmazdı (çünkü dürbün camı parlayıp yerini belli edebilirdi). Keskin nişancılık, düşman askerleri üzerinde devasa bir 'her an ölebilirim' korkusu yaratarak orduların hızını yavaşlatan en ucuz ve etkili psikolojik silah olmuştur.",
    "whyItMatters": "Keskin nişancılık tarihi, teknolojinin değil, sabrın ve gizliliğin savaş meydanındaki belirleyiciliğini kanıtlar.",
    "sources": [
      { "title": "Snipers in WWII (Imperial War Museums)", "url": "https://www.iwm.org.uk/history/the-role-of-the-sniper-in-the-second-world-war", "type": "museum" },
      { "title": "Simo Häyhä: The White Death (National Defense University)", "url": "https://www.doria.fi/handle/10024/181530", "type": "academic" }
    ]
  }
];

const updatedCards = [...cards, ...newCards];
const finalCards = Array.from(new Map(updatedCards.map(c => [c.id, c])).values());

fs.writeFileSync('data/cards.json', JSON.stringify(finalCards, null, 2));

console.log(`Phase Y.5 Batch 3 (Final Prep) Complete: Total cards: ${finalCards.length}`);
