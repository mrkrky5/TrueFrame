const fs = require('fs');
const path = 'data/cards.json';

const enrichmentData = {
  "london-fire-plague": {
    "quickRealityCheck": "Gerçek. 1665 Vebası ve 1666 Büyük Londra Yangını, şehri kökten değiştiren iki ardışık felakettir.",
    "mediaChanged": "Filmlerde genellikle yangın ve veba tek bir kaotik olay gibi gösterilir. Gerçekte veba yangından bir yıl önce zirve yapmıştı ve yangın, ironik bir şekilde vebayı taşıyan farelerin ve pirelerin yaşam alanlarını yok ederek salgının bitmesine yardımcı olmuştur.",
    "realHistory": "1665 yılındaki Büyük Veba, Londra nüfusunun yaklaşık dörtte birini (100.000 kişi) yok etmiştir. Şehir hala bu travmayı atlatmaya çalışırken, 2 Eylül 1666'da bir fırında başlayan yangın, ahşap binalardan oluşan şehri 4 gün içinde kül etmiştir. Yangın, 13.000 evi ve St. Paul Katedrali dahil 87 kiliseyi yok etmiştir.\n\n### Yangın ve Veba Arasındaki İronik İlişki\nYangın, Londra'nın aşırı kalabalık, kirli ve ahşap binalarla dolu dar sokaklarını yok ederek, veba taşıyan farelerin ve pirelerin üreme alanlarını da ortadan kaldırmıştır. Bu durum, salgının hızla sönümlenmesine neden olan beklenmedik bir 'temizlik' etkisi yaratmıştır. Ancak bu temizliğin bedeli, şehrin neredeyse tamamının evsiz kalması olmuştur.\n\n### Modern Londra'nın Doğuşu ve Christopher Wren\nYangın sonrası yıkılan şehir, Christopher Wren gibi vizyoner mimarların elinde yeniden şekillenmiştir. Wren, St. Paul Katedrali'ni yeniden inşa etmiş ve şehrin planını daha geniş caddelerle modernize etmiştir. 1667'de çıkarılan 'Londra Yeniden İnşa Yasası', binaların artık ahşaptan değil, tuğla ve taştan yapılmasını zorunlu kılmıştır. Bu, Londra'nın bugünkü mimari dokusunun ve yangın güvenliği standartlarının temelidir. Ayrıca bu felaket, dünyanın ilk yangın sigorta şirketlerinin kurulmasını da tetiklemiştir.",
    "whyItMatters": "Londra Yangını, modern şehirciliğin, yapı denetim yasalarının ve yangın sigortacılığının doğuşunu tetikleyen en büyük kentsel laboratuvardır."
  },
  "constantinople-fall-turning-new": {
    "quickRealityCheck": "Gerçek. 1453 yılında İstanbul'un fethi, Orta Çağ'ın sonu ve Yeni Çağ'ın başlangıcı kabul edilen küresel bir olaydır.",
    "mediaChanged": "Medya genellikle fethi sadece bir askeri kuşatma olarak gösterir. Gerçekte fethin en büyük etkisi, Bizanslı alimlerin İtalya'ya kaçarak Rönesans'ı tetiklemesi ve ticaret yollarının değişmesiyle Coğrafi Keşiflerin başlamasıdır.",
    "realHistory": "II. Mehmed (Fatih) liderliğindeki Osmanlı ordusu, o dönemin en ileri top teknolojisini kullanarak aşılmaz sanılan Bizans surlarını yıkmıştır. İstanbul'un fethi, sadece bir şehrin el değiştirmesi değil, dünya tarihinin jeopolitik ekseninin kaymasıdır.\n\n### Coğrafi Keşiflerin Tetikleyicisi\nİpek ve Baharat yollarının kontrolünün Osmanlı İmparatorluğu'na geçmesi, Avrupalı tüccarlar için Asya'ya ulaşan yolların pahalılaşması ve riskli hale gelmesi demekti. Bu durum, Portekizli ve İspanyol denizcileri yeni rotalar aramaya itmiştir. Vasco da Gama'nın Ümit Burnu'nu dolaşması ve Kristof Kolomb'un Atlantik'i geçmesi, 1453'ün yarattığı bu ekonomik baskının doğrudan sonuçlarıdır.\n\n### Rönesans ve Bilimsel Göç\nİstanbul'un düşüşü sırasında şehirden kaçan Bizanslı alimler, yanlarında getirdikleri antik Yunanca elyazmalarıyla birlikte İtalya'ya sığınmışlardır. Bu alimler, Floransa ve Venedik'te antik Yunan felsefesine ve sanatına olan ilgiyi canlandırmış, böylece Rönesans'ın başlamasına büyük katkı sağlamışlardır. Ayrıca fetihten sonra İstanbul, 'Cihan Şümul' (evrensel) bir imparatorluk başkenti olarak yeniden imar edilmiş, farklı dinlerin ve kültürlerin bir arada yaşadığı bir merkez haline gelmiştir.",
    "whyItMatters": "İstanbul'un fethi, Orta Çağ'ın feodal dünyasını bitirip, küresel ticaretin ve modern krallıkların doğduğu Yeni Çağ'ı başlatan ana motordur."
  },
  "silk-road-travel-new": {
    "quickRealityCheck": "Gerçek. İpek Yolu tek bir yol değil, Çin ile Akdeniz'i birbirine bağlayan devasa bir ticaret ve fikir ağıydı.",
    "mediaChanged": "Genellikle sadece ipek taşıyan kervanlar gösterilir. Gerçekte bu yoldan sadece ipek değil; kağıt, barut, dinler (Budizm, İslam), diller ve hatta veba gibi hastalıklar da taşınmıştır.",
    "realHistory": "İpek Yolu üzerinde her 30-40 kilometrede bir yer alan Kervansaraylar, antik dünyanın 'lojistik merkezleri'ydi. Tüccarlar burada güvenle konaklıyor, hayvanlarını dinlendiriyor ve farklı milletlerden insanlarla bilgi alışverişinde bulunuyorlardı.\n\n### Kağıt ve Bilginin Yolculuğu\nİpek Yolu'nun tarihe en büyük etkisi, kağıt üretim tekniklerinin Çin'den İslam dünyasına ve oradan Avrupa'ya taşınmasıdır. 751 yılındaki Talas Savaşı'ndan sonra esir alınan Çinli kağıt ustaları, Semerkant ve Bağdat'ta ilk kağıt fabrikalarını kurmuşlardır. Kağıdın ucuzlaması, bilginin yayılmasını hızlandırarak Orta Çağ'da büyük bir entelektüel devrim yaratmıştır.\n\n### Kültürel ve Dini Hibritleşme\nBu yol, sadece malların değil, inançların da yoluydu. Budizm Hindistan'dan Çin'e, İslam ise Orta Asya üzerinden uzak diyarlara bu yol sayesinde ulaşmıştır. İpek Yolu, deniz yollarının keşfiyle önemini kaybetse de, yüzyıllar boyunca insanlık tarihinin en büyük kültürel laboratuvarı olarak kalmıştır. Bugün bu yolun geçtiği güzergahlardaki mutfak kültürü, mimari ve müzik, bu antik küreselleşmenin yaşayan kanıtlarıdır.",
    "whyItMatters": "İpek Yolu, farklı medeniyetlerin birbirini tanımasını sağlayarak dünya kültür mirasının en önemli harcını ve ortak bir insanlık belleğini oluşturmuştur."
  }
};

let cards = JSON.parse(fs.readFileSync(path, 'utf8'));
let count = 0;

cards = cards.map(card => {
  if (enrichmentData[card.id]) {
    count++;
    return { ...card, ...enrichmentData[card.id] };
  }
  return card;
});

fs.writeFileSync(path, JSON.stringify(cards, null, 2), 'utf8');
console.log(`Enriched ${count} standard cards to premium standards.`);
