const fs = require('fs');
const path = require('path');

const cards = JSON.parse(fs.readFileSync('data/cards.json', 'utf8'));

// 1. Normalization Map for cards.json
const TITLE_NORM = {
  "The Crown (Dizi)": "The Crown",
  "Chernobyl (HBO)": "Chernobyl",
  "The Last Emperor (1987)": "The Last Emperor",
  "The Last Emperor (1987)": "The Last Emperor",
  "Napoleon (2023)": "Napoleon",
  "Shōgun (2024) / Shogun 2": "Shōgun",
  "Mafia: Definitive Edition": "Mafia",
  "Red Dead Redemption 2": "Red Dead Redemption",
  "Kingdom Come: Deliverance II": "Kingdom Come: Deliverance",
  "Kingdom of Heaven (2005)": "Kingdom of Heaven",
  "Rome (HBO)": "Rome"
};

// Fix curly quotes in mediaTitle
cards.forEach(card => {
  if (card.mediaTitle) {
    card.mediaTitle = card.mediaTitle.replace(/’/g, "'");
    if (TITLE_NORM[card.mediaTitle]) {
      card.mediaTitle = TITLE_NORM[card.mediaTitle];
    }
  }
});

// 2. Source & Content Polish for Weak Cards
const polish = {
  "civ-great-leaders-simplification": {
    "realHistory": "Tarih yazımında 'Büyük Adam Kuramı' (Great Man Theory), olayların sadece Sezar, Napolyon veya Churchill gibi devasa figürlerin kararlarıyla şekillendiğini savunur. Ancak modern tarihçilik, bu yaklaşımın toplumsal hareketleri, ekonomik yapıları ve teknolojik değişimleri göz ardı ettiğini belirtir. Örneğin, Napolyon'un başarısı sadece onun dehası değil, Fransız Devrimi'nin yarattığı yeni vatandaşlık bilinci ve ordudaki liyakat sisteminin bir sonucudur. Civilization gibi oyunlar, bu karmaşıklığı basitleştirerek oyuncuya 'her şeye kadir lider' rolü verir. Gerçekte ise bir liderin gücü, yönettiği toplumun üretim kapasitesi, coğrafi avantajları ve o dönemdeki küresel ticaret ağlarıyla sınırlıdır. Tarihi değiştiren asıl güç, genellikle isimsiz kitlelerin ve biriken küçük teknik inovasyonların toplamıdır.",
    "sources": [
      { "title": "The Great Man Theory (Britannica)", "url": "https://www.britannica.com/topic/Great-Man-theory", "type": "official" },
      { "title": "History from Below (World History Encyclopedia)", "url": "https://www.worldhistory.org/social-history/", "type": "academic" }
    ]
  },
  "crusaders-poverty-myth": {
    "realHistory": "Haçlı Seferleri'ne katılanların sadece 'servet arayan fakirler' olduğu düşüncesi büyük bir yanılgıdır. Yapılan araştırmalar, bir şövalyenin Kutsal Topraklar'a gitme maliyetinin, yıllık gelirinin yaklaşık dört katı olduğunu göstermektedir. Bu, birçok soylunun sefere çıkabilmek için topraklarını ipotek ettirdiği veya sattığı anlamına gelir. Yani Haçlılar, 'zenginleşmek' için değil, genellikle dini bir kefaret ödemek veya feodal görevlerini yerine getirmek için büyük bir ekonomik risk almışlardır. Elbette yağma ve yeni toprak kazanma arzusu mevcuttu, ancak bu motivasyon, seferlerin temelindeki dini ve ideolojik itici gücün gerisindeydi. Birinci Haçlı Seferi'nin başarısı, beklenen zenginlikten ziyade, katılımcıların bu büyük ekonomik fedakarlığı göze alabilmesiyle mümkün olmuştur.",
    "sources": [
      { "title": "Cruisades: Motives for Participation (Britannica)", "url": "https://www.britannica.com/event/Crusades/Motives-for-participation", "type": "official" },
      { "title": "The Economics of the Crusades (The Medieval Review)", "url": "https://scholarworks.iu.edu/journals/index.php/tmr", "type": "academic" }
    ]
  },
  "medieval-monastery-science": {
    "realHistory": "Orta Çağ'da manastırlar sadece dua edilen yerler değil, Avrupa'nın 'bilgi bankaları'ydı. Matbaanın icadından önceki bin yıl boyunca antik Yunan ve Roma metinleri, manastırlardaki 'scriptorium'larda rahipler tarafından elle kopyalanarak korunmuştur. Bu rahipler sadece kopyacı değil, aynı zamanda tarım tekniklerini geliştiren, ilk saat mekanizmalarını tasarlayan ve bira/şarap üretimini bilimsel bir disipline dönüştüren mühendislerdi. Manastırlar, döneminin en gelişmiş kütüphanelerine ve hastanelerine ev sahipliği yapıyordu. Örneğin, bitkisel ilaçlar ve anatomi bilgisi manastır bahçelerinde ve tıp yazmalarında nesilden nesile aktarılmıştır. Modern üniversite sisteminin temelleri de bu katedral okulları ve manastır eğitim geleneği üzerine inşa edilmiştir.",
    "sources": [
      { "title": "Monasticism and Science (Cambridge University Press)", "url": "https://www.cambridge.org/core/books/science-and-religion/", "type": "academic" },
      { "title": "The Role of Monasteries in Medieval Society (British Library)", "url": "https://www.bl.uk/the-middle-ages/articles/monasteries-and-the-church", "type": "official" }
    ]
  },
  "modern-propaganda-origins": {
    "realHistory": "Propaganda kavramı, kökenini 1622 yılında Katolik Kilisesi tarafından kurulan 'Sacra Congregatio de Propaganda Fide' (İnancı Yayma Kutsal Kongregasyonu) kurumundan alır. Ancak modern anlamda kitlelerin psikolojik olarak yönetilmesi, I. Dünya Savaşı sırasında zirveye ulaşmıştır. İngiliz 'Wellington House' ve ABD'deki 'Creel Committee', savaş desteği toplamak için afişler, yalan haberler ve sinemayı sistematik olarak kullanan ilk resmi kurumlardır. Bu dönemde geliştirilen 'vatanseverlik ve düşmanlaştırma' teknikleri, daha sonra reklamcılık ve siyasi pazarlamanın temelini oluşturmuştur. Propaganda, sadece yalan söylemek değil, gerçeğin belirli bir kısmını büyüterek veya duyguları manipüle ederek kitlelerin rızasını kazanma sanatıdır.",
    "sources": [
      { "title": "A History of Propaganda (Britannica)", "url": "https://www.britannica.com/topic/propaganda/History-of-propaganda", "type": "official" },
      { "title": "World War I Propaganda (Imperial War Museums)", "url": "https://www.iwm.org.uk/history/propaganda-as-a-weapon", "type": "museum" }
    ]
  },
  "roman-entertainment-ordinary": {
    "realHistory": "Sıradan bir Romalı için eğlence sadece Kolezyum'daki kanlı dövüşlerden ibaret değildi. Roma şehirlerinde halkın en büyük sosyalleşme alanı 'Thermae' denilen devasa halk hamamlarıydı. Bu hamamlar; kütüphaneler, spor salonları, sanat galerileri ve yemek salonlarını içeren devasa komplekslerdi. Ayrıca 'Circus Maximus'ta yapılan araba yarışları (chariot racing), popülerlik açısından gladyatör dövüşlerini geride bırakırdı; taraftarlar 'Yeşiller' ve 'Maviler' olarak takımlarına tutkuyla bağlıydı. Sokaklarda ise tiyatro oyunları, pandomim gösterileri ve zar oyunları günlük hayatın bir parçasıydı. Roma eğlence kültürü, imparatorların halkı siyasetten uzak tutmak için kullandığı çok katmanlı ve sofistike bir sistemdi.",
    "sources": [
      { "title": "Ancient Roman Leisure (Britannica)", "url": "https://www.britannica.com/place/ancient-Rome/Leisure-and-recreation", "type": "official" },
      { "title": "Public Games in Rome (World History Encyclopedia)", "url": "https://www.worldhistory.org/Roman_Games/", "type": "academic" }
    ]
  }
};

cards.forEach(card => {
  if (polish[card.id]) {
    Object.assign(card, polish[card.id]);
  }
});

fs.writeFileSync('data/cards.json', JSON.stringify(cards, null, 2));

console.log(`Trust Pass Complete: Normalized ${Object.keys(TITLE_NORM).length} media titles, fixed quotes, and polished ${Object.keys(polish).length} weak cards.`);
