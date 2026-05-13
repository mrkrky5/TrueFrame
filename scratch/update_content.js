const fs = require('fs');
const path = require('path');

const cards = JSON.parse(fs.readFileSync('data/cards.json', 'utf8'));

// 1. Enrichments
const enrichments = {
  "napoleon-height": {
    "realHistory": "Napolyon Bonapart'ın 'kısa' olduğu efsanesi, aslında bir ölçü birimi karışıklığından doğmuştur. Napolyon öldüğünde boyu 5 ayak 2 inç (5'2\") olarak kaydedilmişti; ancak bu o dönem kullanılan Fransız ölçü birimiydi. Fransız 'pouce' (inç) birimi 2.71 cm iken, İngiliz inç birimi 2.54 cm idi. İngiliz ölçü birimine çevrildiğinde Napolyon'un boyu yaklaşık 1.68 - 1.70 metredir. Bu boy, 19. yüzyıl başındaki ortalama bir Fransız erkeğinin boyundan (yaklaşık 1.65 m) daha uzundur. Napolyon'un 'Küçük Onbaşı' (Le Petit Caporal) lakabı ise boyuyla değil, askerleriyle olan yakın ilişkisi ve rütbesinden daha alçakgönüllü davranmasıyla ilgili bir sevgi ifadesidir. Ayrıca, yanındaki 'İmparatorluk Muhafızları'nın (Old Guard) özellikle çok uzun boylu askerlerden seçilmesi, Napolyon'un onların yanında daha kısa görünmesine neden olmuştur.",
    "quickRealityCheck": "Napolyon aslında döneminin ortalamasından daha uzundu; 'kısa' imajı bir çeviri hatası ve İngiliz propagandasıdır.",
    "mediaChanged": "İngiliz karikatüristler James Gillray gibi isimler, Napolyon'u devasa çizmeler içinde minicik bir çocuk gibi resmederek bu miti kalıcı hale getirmiştir.",
    "whyItMatters": "Bu durum, bir siyasi figürün fiziksel özelliklerinin propaganda yoluyla nasıl tarihe yanlış kazınabileceğinin en net örneklerinden biridir.",
    "readingTimeMinutes": 4
  },
  "shogun2-shinobi": {
    "realHistory": "Sinemada gördüğümüz siyah kıyafetli, maskeli 'ninja' imajı aslında 19. yüzyıl tiyatrosundan kalma bir kurgudur. Gerçek shinobi'ler (gizlenenler), Sengoku döneminin profesyonel casuslarıydı. En büyük yetenekleri 'görünmez' olmaları değil, 'fark edilmemeleriydi'. Çiftçi, rahip, gezgin müzisyen veya tüccar kılığına girerek düşman kalelerine sızarlardı. En ünlü merkezleri olan Iga ve Koga bölgeleri, dağlık yapısı sayesinde bu tür gerilla taktiklerinin geliştiği yerlerdi. Ninja el kitabı olan 'Bansenshukai', suikastten ziyade psikolojik savaş, gizli dinleme ve barut kullanımı üzerine odaklanır. Siyah yerine koyu lacivert veya kahverengi gibi gece karanlığında daha iyi gizleyen renkler tercih ederlerdi. Ninja yıldızları (shuriken) ise öldürücü bir silahtan ziyade, kaçarken düşmanın dikkatini dağıtmak için kullanılan yardımcı bir araçtı.",
    "quickRealityCheck": "Gerçek ninjalar suikastçıdan çok profesyonel casuslardı ve asla siyah maskeli kostümler giyip ortalıkta dolaşmazlardı.",
    "mediaChanged": "Tiyatro sahnelerinde 'görünmez' yardımcıları temsil eden siyah giyimli sahne görevlileri (kuroko), zamanla ninjaların simgesi haline geldi.",
    "whyItMatters": "Shinobi'lerin varlığı, feodal Japonya'nın sadece kılıç düellolarından değil, karmaşık bir istihbarat ağından ibaret olduğunu gösterir.",
    "readingTimeMinutes": 5
  },
  "last-emperor-china-fall": {
    "realHistory": "Çin'in son imparatoru Puyi'nin hayatı, sadece kişisel bir dram değil, binlerce yıllık imparatorluk düzeninin çöküşünün sembolüdür. 1911 Xinhai Devrimi ile Qing Hanedanlığı devrildiğinde Puyi henüz 6 yaşındaydı. Devrim sonrası imzalanan 'Yasak Şehir'deki İmparatorun Şartlı Tahliyesi' anlaşmasıyla, 1924 yılına kadar sarayında lüks içinde ama dünyadan kopuk bir mahkum gibi yaşadı. 1930'larda Japonya tarafından kurulan kukla devlet Mançukuo'nun başına getirilmesi, onun bir siyasi piyon olarak kullanıldığının en acı kanıtıdır. II. Dünya Savaşı sonrası Sovyetlere esir düşen ve ardından Mao yönetimindeki Çin'de 'yeniden eğitim' alan Puyi, hayatını sıradan bir vatandaş ve bahçıvan olarak tamamlamıştır. Bu dönüşüm, Çin'in feodal bir yapıdan modern bir komünist devlete geçişindeki travmatik sürecin aynasıdır.",
    "quickRealityCheck": "Puyi'nin tahttan inişi bir son değil, Çin'in modernleşme sancılarının başlangıcıydı.",
    "mediaChanged": "Bernardo Bertolucci'nin filmi atmosferik olarak mükemmel olsa da, Puyi'nin Mançukuo dönemindeki aktif işbirliğini ve Japon zulmündeki payını biraz daha insancıl bir çerçevede sunar.",
    "whyItMatters": "Puyi'nin hikayesi, kişisel kimliğin ideolojik sistemler karşısında ne kadar kırılgan olabileceğini gösteren benzersiz bir biyografidir.",
    "readingTimeMinutes": 6
  },
  "mongol-horse-archery": {
    "realHistory": "Moğol İmparatorluğu'nu dünyanın en büyük bitişik imparatorluğu yapan asıl güç, her askerin küçük yaştan itibaren aldığı sıkı disiplinli askeri eğitimdir. Moğol bileşik yayı (composite bow), hayvan boynuzu, kemik ve sinirden yapılırdı ve döneminin Avrupa yaylarına göre çok daha üstün bir gerilme gücüne sahipti. Bir Moğol atlısı, atın dört ayağının da havada olduğu o saniyelik anda ok atarak, sarsıntıyı minimuma indirir ve 300 metreye kadar isabetli atış yapabilirdi. Seferler sırasında her askerin yanında 4 ila 6 yedek at bulunurdu. Bu sayede atlar dinlenirken ordu hiç durmadan günde 100 kilometreden fazla mesafe katedebilirdi. Ayrıca Moğollar, 'sahte geri çekilme' (turan taktiği) ile düşmanı pusuya düşürmekte uzmandı. Bu taktik, disiplinsiz orduların zafer sarhoşuyla saflarını bozmasına neden olur ve ardından ani bir karşı saldırıyla onları yok ederdi.",
    "quickRealityCheck": "Moğollar sadece sayıca fazla oldukları için değil, döneminin en ileri askeri teknolojisine ve lojistik sistemine sahip oldukları için kazandılar.",
    "mediaChanged": "Oyunlar genellikle bu hızı 'sınırsız stamina' gibi gösterse de, gerçekte bu güç çok hassas bir at rotasyonu ve lojistik planlama gerektiriyordu.",
    "whyItMatters": "Moğol askeri sistemi, tarihte lojistiğin ve teknolojinin sayısal üstünlükten daha önemli olduğunun en net kanıtıdır.",
    "readingTimeMinutes": 5
  },
  "valiant-hearts-wwi": {
    "realHistory": "Birinci Dünya Savaşı sadece askerlerin değil, tüm toplumun dahil olduğu ilk 'topyekün savaş' (total war) örneğidir. Fransa ve Belçika'daki sivil halk, savaşın ön cephesinin hemen arkasında, sürekli bombardıman ve işgal tehdidi altında yaşadı. Valiant Hearts oyununda gördüğümüz karakterlerin aksine, gerçek siviller genellikle zorunlu çalışma kamplarına gönderiliyor veya gıda kıtlığı nedeniyle açlıkla pençeleşiyordu. Kadınlar, cepheye giden erkeklerin yerini alarak mühimmat fabrikalarında (Canary Girls) ve tarımda kritik roller üstlendiler. Bu dönem, tıbbın da büyük bir dönüşüm geçirdiği bir zamandı; yüz yaralanmaları için ilk estetik cerrahi teknikleri ve travma sonrası stres bozukluğu (shell shock) ilk kez bu savaşta tanımlandı. Savaşın sonunda imzalanan Versay Antlaşması, siviller için bir kurtuluş gibi görünse de, aslında II. Dünya Savaşı'na giden yolu döşeyen ekonomik ve psikolojik yıkımı başlatmıştı.",
    "quickRealityCheck": "I. Dünya Savaşı'nın asıl yıkımı siperlerde değil, savaşın içine çekilen ve hayatı sonsuza dek değişen sivil toplumda yaşandı.",
    "mediaChanged": "Valiant Hearts gibi yapımlar genellikle bireysel hikayelere odaklanır ancak dönemin kitlesel yerinden edilme ve sistemik kıtlık gibi devasa boyutlarını tam olarak yansıtmakta zorlanır.",
    "whyItMatters": "Sivil hayatın savaşın bir parçası haline gelmesi, modern savaş hukukunun ve insani yardım kuruluşlarının doğuşuna zemin hazırlamıştır.",
    "readingTimeMinutes": 6
  },
  "ghost-onna-musha": {
    "realHistory": "Samuray sınıfında kadınlar, sadece ev işleriyle meşgul olan figürler değil, 'Onna-musha' olarak bilinen ve gerektiğinde kalelerini savunmak üzere eğitilen savaşçılardı. En ünlü silahları, menzil avantajı sağlayan 'naginata' (uzun saplı kavisli kılıç) idi. 13. yüzyıldaki Moğol istilaları sırasında (Ghost of Tsushima dönemi), kadın savaşçıların varlığına dair kayıtlar bulunmaktadır. Tomoe Gozen ve Hojo Masako gibi isimler, sadece birer figüran değil, ordulara komuta eden veya siyaseti yöneten güçlü liderlerdi. Edo dönemine geçilmesiyle birlikte konfüçyüsçü ideolojinin güçlenmesi, kadınların bu savaşçı rolünü daha çok sembolik bir düzeye indirmiş olsa da, samuray ailelerinde kadınların onur ve strateji eğitimi almaları bir zorunluluktu. Ghost of Tsushima'daki Lady Masako karakteri, bu tarihsel Onna-musha geleneğinin dramatize edilmiş ancak temeli gerçek bir temsilidir.",
    "quickRealityCheck": "Feodal Japonya'da kadınlar sadece kurban veya eş değil, gerektiğinde zırh giyip savaşan eğitimli askeri sınıfların bir parçasıydı.",
    "mediaChanged": "Oyunlardaki kadın savaşçılar genellikle 'istisna' gibi gösterilir; oysa samuray kadınların mülklerini ve onurlarını savunmak için eğitilmeleri bir sosyal sınıfsal standarttı.",
    "whyItMatters": "Onna-musha geleneği, tarihte toplumsal cinsiyet rollerinin savaş ve kriz anlarında ne kadar esnek olabileceğinin kanıtıdır.",
    "readingTimeMinutes": 5
  },
  "ac2-davinci-tank": {
    "realHistory": "Leonardo da Vinci'nin 1482-1485 yılları arasında tasarladığı 'tank', aslında bir savaş meydanından çok bir mühendislik vizyonudur. Dış kabuğu kaplumbağa kabuğuna benzeyen ve ahşaptan yapılan bu araç, 360 derece ateş edebilen hafif toplarla donatılmıştı. Ancak Assassin's Creed II oyununda gördüğümüz çevik ve yıkıcı gücün aksine, gerçek tasarımın ciddi kusurları vardı. Aracın tekerlekleri zıt yönlere dönecek şekilde çizilmişti; bu da aracın ilerlemesini imkansız kılıyordu. Tarihçiler bunun bir hata mı yoksa Leonardo'nun bu yıkıcı silahın kötü niyetli ellerde kullanılmasını engellemek için kasıtlı olarak yaptığı bir sabote mi olduğunu hala tartışmaktadır. Ayrıca, aracın tamamen insan gücüyle (8 kişi) hareket ettirilmesi planlanmıştı, bu da aracın engebeli arazilerde neredeyse hareketsiz kalacağı anlamına geliyordu. Bu tank hiçbir zaman inşa edilmedi, ancak Da Vinci'nin 'korkutma ve şaşırtma' yoluyla zafer kazanma stratejisinin bir parçası olarak kağıt üzerinde kaldı.",
    "quickRealityCheck": "Da Vinci'nin tankı gerçekte inşa edilmedi ve çizimindeki kasıtlı bir mekanik hata nedeniyle hareket etmesi imkansızdı.",
    "mediaChanged": "Assassin's Creed II, bu teorik tasarımı işlevsel ve modern bir tank gibi sunarak Rönesans teknolojisini olduğundan çok daha ileri bir noktada gösterir.",
    "whyItMatters": "Da Vinci'nin tasarımları, Rönesans döneminde hayal gücünün ve bilimin teknik imkanların ne kadar ötesine geçebildiğini kanıtlar.",
    "readingTimeMinutes": 4
  }
};

// 2. New Cards (Standard & Flagship)
const newCards = [
  {
    "id": "ac-assassin-order-real",
    "title": "Gerçek Haşhaşiler: Alamut’un Fedaileri",
    "subtitle": "Efsanelerin ardındaki Nizari İsmaili Devleti.",
    "mediaType": "game",
    "mediaTitle": "Assassin's Creed",
    "difficulty": "deep",
    "readingTimeMinutes": 6,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Haşhaşiler", "Orta Doğu", "Siyaset"],
    "isFlagship": false,
    "accuracyType": "partly-real",
    "spoilerLevel": "none",
    "tags": ["assassins-creed", "hassasiler", "alamut", "orta-dogu"],
    "quickRealityCheck": "Assassin's Creed'deki beyaz cübbeli 'dünya barışı' savunucuları, aslında 11. yüzyılda Orta Doğu'da hüküm süren ve siyasi suikastları bir hayatta kalma stratejisi olarak kullanan Nizari İsmaili devletidir.",
    "mediaChanged": "Oyunlardaki 'Assassin vs Templar' ezeli savaşı kurgusaldır. Gerçek Haşhaşiler (Assassins), Haçlılarla bazen savaşmış, bazen de Selçuklulara karşı ittifak kurmuşlardır. İsimlerinin 'Haşhaş'tan gelmesi ise büyük oranda düşmanlarının (Sünni ve Haçlı kaynakları) onları karalamak için uydurduğu bir yakıştırmadır.",
    "realHistory": "Haşhaşiler, Hasan Sabbah tarafından 1090 yılında Alamut Kalesi'nin ele geçirilmesiyle kurulan bir topluluktur. Büyük ordulara karşı koyamayacak kadar küçük bir nüfusa sahip oldukları için, düşman liderlerine yönelik suikastları bir savunma doktrini haline getirmişlerdir. Fedailer, aylar süren eğitimlerden geçer, hedef dillerini öğrenir ve düşman saraylarına sızarlardı. En ünlü hedefleri Selçuklu veziri Nizamülmülk olmuştur. Alamut, 1256 yılında Moğollar tarafından yıkılana kadar kütüphaneleri ve bilimsel çalışmalarıyla da bilinen bir merkezdi. Haçlılar, bu korkutucu toplulukla Kutsal Topraklar'da tanışmış ve 'Assassin' ismini Avrupa'ya taşıyarak bu korkunç şöhreti efsaneye dönüştürmüşlerdir.",
    "whyItMatters": "Gerçek Assassins topluluğu, asimetrik savaşın tarihteki en başarılı ve disiplinli örneklerinden birini temsil eder.",
    "sources": [
      { "title": "The Assassins (Britannica)", "url": "https://www.britannica.com/topic/Assassins", "type": "official" },
      { "title": "Nizari Ismaili State (Oxford Research Encyclopedia)", "url": "https://oxfordre.com/religion/", "type": "academic" }
    ]
  },
  {
    "id": "rdr-pinkerton-agency",
    "title": "Pinkerton Ajansı: Şirketlerin Özel Ordusu",
    "subtitle": "Kanunla suç arasındaki ince çizgide bir kurum.",
    "mediaType": "game",
    "mediaTitle": "Red Dead Redemption",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Vahşi Batı", "Hukuk", "Şirketler"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["red-dead-redemption", "pinkerton", "vahsi-bati", "abd"],
    "quickRealityCheck": "Red Dead Redemption 2'deki Pinkerton ajanları sadece 'kötü adamlar' değil, 19. yüzyıl sonunda ABD'de federal polisten (FBI öncesi) daha fazla personeli ve gücü olan devasa bir özel güvenlik şirketiydi.",
    "mediaChanged": "Oyun onları yozlaşmış avcılar gibi gösterse de, gerçek Pinkertonlar aynı zamanda Abraham Lincoln'ü korumuş ve ABD'nin ilk gizli servisi gibi çalışmışlardır. Ancak grev kırma olaylarındaki acımasızlıkları oyunun yansıttığından çok daha kanlıdır.",
    "realHistory": "Allan Pinkerton tarafından 1850'de kurulan ajans, 'Asla Uyumayız' (We Never Sleep) sloganıyla tanınırdı. Vahşi Batı'da tren soygunlarının artmasıyla, demiryolu şirketleri tarafından kanun kaçaklarını yakalamak için tutuldular. Jesse James ve Butch Cassidy gibi isimlerin peşine düştüler. Ancak ajansın karanlık yüzü, sanayileşme döneminde ortaya çıktı. Büyük maden ve fabrika sahipleri, işçi grevlerini bastırmak ve sendikacıları sindirmek için Pinkertonları 'kiralık ordu' olarak kullandılar. 1892 Homestead Grevi'nde işçilere ateş açmaları, kamuoyunda büyük nefret toplamalarına neden oldu. Bu olaylar sonrası ABD hükümeti, özel şirketlerin kolluk kuvveti gibi çalışmasını sınırlayan 'Anti-Pinkerton Yasası'nı çıkarmak zorunda kaldı.",
    "whyItMatters": "Pinkerton Ajansı'nın yükselişi ve düşüşü, ABD'de devletin kolluk gücünün özelleşmesinin getirdiği tehlikeleri gösteren tarihi bir derstir.",
    "sources": [
      { "title": "Pinkerton National Detective Agency (Britannica)", "url": "https://www.britannica.com/topic/Pinkerton-National-Detective-Agency", "type": "official" },
      { "title": "The Homestead Strike (Library of Congress)", "url": "https://www.loc.gov/collections/stars-and-stripes/", "type": "official" }
    ]
  },
  {
    "id": "shogun-christian-daimyo",
    "title": "Hristiyan Samuraylar ve Misyoner Gerilimi",
    "subtitle": "Sengoku döneminde inanç ve güç savaşı.",
    "mediaType": "series",
    "mediaTitle": "Shōgun",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Japonya", "Din", "Siyaset"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["shogun", "japonya", "hristiyanlik", "samuray"],
    "quickRealityCheck": "Shōgun dizisinde gördüğümüz Hristiyan Lordlar (Lord Kiyama ve Ohno gibi), aslında Portekizli Cizvitlerden ateşli silah yardımı almak ve ticari avantaj elde etmek için din değiştiren gerçek daimyo'lara dayanmaktadır.",
    "mediaChanged": "Dizi din değiştirmeyi daha çok bir 'komplo' gibi sunsa da, birçok daimyo için bu, barutlu silah teknolojisine (Tanegashima) erişim sağlamanın tek yoluydu.",
    "realHistory": "1549'da misyoner Francis Xavier'in Japonya'ya gelişiyle Hristiyanlık hızla yayıldı. Kyushu adasındaki birçok daimyo, Avrupa ticaret gemilerinin kendi limanlarına uğramasını sağlamak için din değiştirdi. Ancak bu durum, Budist manastırları ve Japonya'nın geleneksel hiyerarşisiyle büyük çatışmalar doğurdu. Oda Nobunaga, Budist rahiplerin gücünü kırmak için Hristiyanlığa müsamaha gösterse de, Toyotomi Hideyoshi ve daha sonra Tokugawa Ieyasu bunu bir 'yabancı istilası tehdidi' olarak gördü. 1597'deki '26 Şehit' olayı ve ardından gelen yasaklar, Japonya'nın 200 yıl sürecek izolasyonuna (Sakoku) zemin hazırladı. Dizideki Mariko gibi karakterler, bu iki dünya arasında sıkışmış binlerce gerçek samurayın dramını temsil eder.",
    "whyItMatters": "Japonya'daki Hristiyanlık süreci, Doğu ve Batı kültürlerinin ilk büyük ve travmatik çarpışmasıdır.",
    "sources": [
      { "title": "Kirishitan (Britannica)", "url": "https://www.britannica.com/topic/Kirishitan", "type": "official" },
      { "title": "Christianity in Japan (St. Andrews University)", "url": "https://www.st-andrews.ac.uk/history/", "type": "academic" }
    ]
  },
  {
    "id": "ghost-mongol-navy",
    "title": "Moğol Donanması ve İlahi Rüzgarlar",
    "subtitle": "İmparatorluğun denize çarptığı an: Kamikaze.",
    "mediaType": "game",
    "mediaTitle": "Ghost of Tsushima",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Japonya", "Moğollar", "Denizcilik"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["ghost-of-tsushima", "moollar", "japonya", "kamikaze"],
    "quickRealityCheck": "Ghost of Tsushima'da Moğolların Tsushima'ya gelişi bir başlangıçtır; gerçekte Kubilay Han'ın devasa donanması, tarihin gördüğü en büyük deniz felaketlerinden birini yaşayarak 'İlahi Rüzgarlar' (Kamikaze) tarafından yok edilmiştir.",
    "mediaChanged": "Oyun karadaki savaşa odaklanır, ancak gerçek istilanın başarısız olma nedeni samurayların kahramanlığından ziyade, Moğol gemilerinin zayıf yapısı ve aniden çıkan tayfunlardır.",
    "realHistory": "Kubilay Han, 1274 ve 1281 yıllarında Japonya'yı işgal etmek için iki büyük filo gönderdi. İkinci filo, o güne kadar görülmüş en büyük deniz armada'larından biriydi. Ancak Moğolların bozkır kültürü denizciliğe uygun değildi; gemiler Koreli ve Çinli mühendisler tarafından aceleyle inşa edilmişti. Japon savunması karada direniş gösterirken, aniden çıkan bir tayfun (Kamikaze), Moğol filosunun %80'ini sulara gömdü. Bu olay Japonlarda 'tanrıların kendilerini koruduğu' inancını pekiştirdi. Arkeolojik sualtı araştırmaları, gemilerin perçinlerinin zayıf olduğunu ve açık deniz fırtınalarına dayanacak şekilde tasarlanmadığını doğrulamıştır.",
    "whyItMatters": "Moğol istilalarının başarısızlığı, Japonya'nın içe dönük ve mistik kimliğinin oluşmasında en önemli dönüm noktasıdır.",
    "sources": [
      { "title": "The Mongol Invasions (National Geographic)", "url": "https://www.nationalgeographic.com/history/", "type": "official" },
      { "title": "Kublai Khan's Fleet (Kyushu University Research)", "url": "https://www.kyushu-u.ac.jp/", "type": "academic" }
    ]
  },
  {
    "id": "mafia-prohibition-economics",
    "title": "İçki Yasağı ve Mafyanın Altın Çağı",
    "subtitle": "Hukuksuzluğun ekonomisi ve speakeasy kültürü.",
    "mediaType": "game",
    "mediaTitle": "Mafia",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Suç", "Ekonomi", "ABD"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["mafia", "icki-yasagi", "abd", "ekonomi"],
    "quickRealityCheck": "Mafia oyunundaki alkol kaçakçılığı, 1920'lerin ABD'sinde sadece 'yeraltı ticareti' değil, vergi kaybı ve yolsuzlukla tüm devlet sistemini felç eden milyar dolarlık bir endüstriydi.",
    "mediaChanged": "Oyunlarda içki yasağı bir 'aksiyon teması' olsa da, gerçekte bu dönem organize suçun ilk kez kurumsallaştığı ve modern kara para aklama yöntemlerinin geliştirildiği bir laboratuvardır.",
    "realHistory": "1920'de yürürlüğe giren 18. Anayasa değişikliği (Prohibition), alkolün üretimini ve satışını yasakladı. Ancak talep azalmadı, sadece el değiştirdi. Al Capone ve Johnny Torrio gibi isimler, Kanada'dan içki getirerek ve gizli damıtma evleri kurarak devasa servetler edindiler. 'Speakeasy' denilen gizli barlar, polis rüşvetleri sayesinde şehirlerin göbeğinde çalışmaya devam etti. Bu dönemde mafya, sadece içki değil; nakliye, siyaset ve sendikalar üzerinde de kontrol kurdu. 1933'te yasak kalktığında mafya artık o kadar güçlenmişti ki, elindeki sermayeyi kumar ve uyuşturucu gibi diğer yasadışı alanlara kolayca kaydırdı.",
    "whyItMatters": "İçki Yasağı, yasakların bazen suçun büyümesine nasıl zemin hazırlayabileceğinin en trajik tarihi örneğidir.",
    "sources": [
      { "title": "Prohibition (Britannica)", "url": "https://www.britannica.com/event/Prohibition-United-States-history-1920-1933", "type": "official" },
      { "title": "The Rise of Organized Crime (FBI Records)", "url": "https://vault.fbi.gov/", "type": "official" }
    ]
  },
  {
    "id": "ac-crusader-urban-life",
    "title": "Haçlı Kentlerinde Yaşam: Akka ve Kudüs",
    "subtitle": "Kutsal Topraklarda günlük hayatın karmaşası.",
    "mediaType": "game",
    "mediaTitle": "Assassin's Creed",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Orta Çağ", "Din", "Gündelik Yaşam"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["assassins-creed", "haclilar", "kudus", "orta-cag"],
    "quickRealityCheck": "Assassin's Creed'deki Haçlı şehirleri sadece savaş alanları değil, Müslüman, Hristiyan ve Yahudi tüccarların yan yana ticaret yaptığı, Akdeniz'in en kozmopolit merkezleriydi.",
    "mediaChanged": "Oyun şehirleri daha çok 'soğuk ve gergin' birer kale gibi gösterse de, Haçlı devletlerindeki günlük yaşam, Avrupa ve Doğu kültürlerinin birbirine karıştığı yoğun bir etkileşim alanıydı.",
    "realHistory": "12. yüzyılda Akka (Acre) limanı, dünyanın en kalabalık ticaret limanlarından biriydi. Venedikli ve Cenevizli tüccarların kendi mahalleleri vardı. Şehirlerde kanalizasyon sistemleri ve hamamlar (Doğu etkisiyle) oldukça yaygındı. Haçlı Lordları, yerel halktan vergi almak ve düzeni sağlamak için Müslüman memurlarla çalışmak zorundaydı. Kudüs ise tamamen dini bir merkezdi; hacılar dünyanın dört bir yanından gelir, sokaklarda her dilden insan görülürdü. Haçlılar, bölgenin iklimine uyum sağlamak için zırhlarının üzerine beyaz tunikler giyer ve yerel beslenme alışkanlıklarını benimserlerdi.",
    "whyItMatters": "Haçlı şehirleri, tarihte çatışmanın ortasında bile ticaretin ve kültürel alışverişin durmadığını gösteren birer 'mikro-kozmos'dur.",
    "sources": [
      { "title": "Crusader States (Britannica)", "url": "https://www.britannica.com/topic/Crusader-states", "type": "official" },
      { "title": "Daily Life in Outremer (Heidelberg University)", "url": "https://www.uni-heidelberg.de/", "type": "academic" }
    ]
  },
  {
    "id": "rdr-railroad-conquest",
    "title": "Demiryolları ve Vahşi Batı'nın Sonu",
    "subtitle": "Çeliğin vahşi doğayı evcilleştirmesi.",
    "mediaType": "game",
    "mediaTitle": "Red Dead Redemption",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Vahşi Batı", "Teknoloji", "Modernleşme"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["red-dead-redemption", "demiryolu", "vahsi-bati", "abd"],
    "quickRealityCheck": "Red Dead Redemption'da gördüğümüz demiryolu inşası, sadece bir ulaşım projesi değil; silah zoruyla yerli topraklarına el konulan ve Batı'nın 'özgür' ruhunun devlet kontrolü altına girmesini sağlayan bir fetih aracıydı.",
    "mediaChanged": "Oyun demiryolunu 'yolun sonu' olarak melankolik bir dille anlatır, ancak bu sürecin arkasındaki devasa yolsuzluk ve yerli kabilelerin sistematik yok edilişi oyunun yansıttığından daha şiddetlidir.",
    "realHistory": "1869'da Transcontinental Railroad'un tamamlanması, aylarca süren yolculukları bir haftaya indirdi. Demiryolları beraberinde telgraf hatlarını da getirdi; bu da 'hukuktan kaçmanın' imkansız hale gelmesi demekti. Demiryolu şirketleri, devletten bedelsiz toprak alarak ABD tarihinin en güçlü kurumları haline geldiler. Buffalo (Bizon) sürülerinin demiryollarını engellememesi için sistematik olarak katledilmesi, yerli halkların (Sioux, Cheyenne vb.) temel gıda kaynağını yok etti ve onları rezervasyonlara mahkum etti. Demiryolu, Vahşi Batı'yı romantize edilen o 'kanunsuzluktan' çıkarıp, birer vergi ve ticaret kolonisine dönüştürdü.",
    "whyItMatters": "Demiryolları, teknolojinin sadece mesafeleri değil, yaşam tarzlarını ve medeniyetleri nasıl kalıcı olarak değiştirebileceğinin simgesidir.",
    "sources": [
      { "title": "The Transcontinental Railroad (National Archives)", "url": "https://www.archives.gov/milestone-documents/pacific-railway-act", "type": "official" },
      { "title": "Westward Expansion (Smithsonian Institution)", "url": "https://www.si.edu/", "type": "museum" }
    ]
  },
  {
    "id": "shogun-sankin-kotai",
    "title": "Sankin-kotai: Rehineler ve Refah",
    "subtitle": "Tokugawa'nın daimyo'ları kontrol etme sanatı.",
    "mediaType": "series",
    "mediaTitle": "Shōgun",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Japonya", "Siyaset", "Edo Dönemi"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["shogun", "japonya", "siyaset", "edo-donemi"],
    "quickRealityCheck": "Shōgun dizisinde Lord Toranaga'nın Osaka'da rehin kalması bir başlangıçtır; gerçek Tokugawa Şogunluğu bunu 'Sankin-kotai' adıyla sistematik bir devlet politikası haline getirerek tüm lordları iflas ettirmiş ve isyanı imkansız kılmıştır.",
    "mediaChanged": "Dizi rehineliği bir savaş öncesi 'tuzak' gibi gösterse de, gerçekte bu sistem Edo döneminin istikrarını sağlayan en büyük bürokratik mekanizmaydı.",
    "realHistory": "Tokugawa Ieyasu tarafından resmileştirilen bu sistemde, her daimyo (derebeyi) yılın yarısını Edo'da (modern Tokyo) şogunun gözü önünde geçirmek zorundaydı. Edo'dan ayrıldıklarında ise ailelerini (karılarını ve çocuklarını) Edo'da rehin bırakırlardı. Bu seyahatler o kadar masraflıydı ki (yüzlerce koruma, lüks konaklama), daimyo'lar askeri güç biriktirmek için gereken parayı sürekli yollarda harcamak zorunda kalırlardı. Ancak bu zorunlu trafik, Japonya'da yolların gelişmesine, konaklama sektörünün doğmasına ve Edo'nun dünyanın en büyük şehirlerinden birine dönüşmesine neden oldu.",
    "whyItMatters": "Sankin-kotai, bir diktatörlüğün fiziksel şiddet yerine ekonomik ve bürokratik yüklerle nasıl 250 yıl süren bir barış sağlayabileceğinin örneğidir.",
    "sources": [
      { "title": "Sankin-kotai (Britannica)", "url": "https://www.britannica.com/topic/sankin-kotai", "type": "official" },
      { "title": "Edo Period Governance (University of Tokyo Press)", "url": "https://www.u-tokyo.ac.jp/", "type": "academic" }
    ]
  },
  {
    "id": "mafia-five-families",
    "title": "Beş Aile: New York’un Gizli Sahipleri",
    "subtitle": "Modern mafya hiyerarşisinin doğuşu.",
    "mediaType": "game",
    "mediaTitle": "Mafia",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Suç", "New York", "Modern Tarih"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["mafia", "su-ve-mafya", "new-york", "abd"],
    "quickRealityCheck": "Mafia oyunundaki aile içi çekişmeler, gerçek hayatta 1931'de Lucky Luciano'nun 'Castellammarese Savaşı'nı bitirerek New York'u beş büyük aile (Gambino, Lucchese, Genovese, Bonanno, Colombo) arasında paylaştırmasına dayanır.",
    "mediaChanged": "Oyunlar mafyayı genellikle 'Don' merkezli tek bir yapı gibi sunar ancak gerçekte bu, 'Komisyon' (The Commission) adı verilen bir kurul tarafından yönetilen, şirket benzeri bir federasyondu.",
    "realHistory": "Lucky Luciano, 'Eski Dünya' mafya liderlerini (Mustache Petes) tasfiye ederek mafyayı 'modernleştirdi'. Her ailenin bir bölgesi ve uzmanlık alanı vardı. Aileler arası çatışmaları önlemek için kurulan 'Komisyon', bir nevi mafya yönetim kurulu gibi çalışıyordu. Bu yapı o kadar gizli ve disiplinliydi ki, 1957'deki ünlü Apalachin Toplantısı polisin baskınına uğrayana kadar Amerikan kamuoyu mafyanın bu kadar örgütlü olduğuna inanmıyordu. Beş Aile sistemi, şantajdan sendika kontrolüne kadar New York ekonomisinin her damarına sızdı ve ancak 1980'lerdeki RICO yasalarıyla ciddi darbeler aldı.",
    "whyItMatters": "Organize suçun bir 'kurul' tarafından yönetilmesi, suçun sadece bir asayiş sorunu değil, aynı zamanda bir kurumsallaşma biçimi olduğunu gösterir.",
    "sources": [
      { "title": "The Commission (Britannica)", "url": "https://www.britannica.com/topic/The-Commission-crime-syndicate", "type": "official" },
      { "title": "La Cosa Nostra (FBI Library)", "url": "https://www.fbi.gov/investigate/organized-crime", "type": "official" }
    ]
  },
  {
    "id": "ac-templar-fall",
    "title": "Tapınak Şövalyeleri: Yükselişten İnfaza",
    "subtitle": "Kutsal Savaşçılardan Avrupa'nın bankacılarına.",
    "mediaType": "game",
    "mediaTitle": "Assassin's Creed",
    "difficulty": "medium",
    "readingTimeMinutes": 6,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Orta Çağ", "Din", "Ekonomi"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["assassins-creed", "tapinak-sovalyeleri", "orta-cag", "fransa"],
    "quickRealityCheck": "Assassin's Creed'deki gizli 'dünya düzeni' kurucuları Templarlar, aslında Haçlı Seferleri sırasında hacıları korumak için kurulan ancak zamanla Avrupa'nın ilk modern bankacılık sistemini kuran çok zengin bir askeri tarikattır.",
    "mediaChanged": "Oyunlar Templarları 'evrensel bir ideoloji' gibi sunsa da, gerçek şövalyeler Papa'ya bağlı katı dini kuralları olan ve Kutsal Topraklar kaybedilince varlık nedenlerini de kaybeden bir gruptu.",
    "realHistory": "1119'da kurulan tarikat, muazzam bağışlar ve vergi muafiyetleri sayesinde hızla zenginleşti. Avrupa ve Orta Doğu arasında güvenli para transferi (ilk çek/senet benzeri yapılar) sistemini geliştirdiler. Ancak Akka'nın (Acre) 1291'de düşüşüyle askeri prestijleri sarsıldı. Onlara çok borcu olan Fransa Kralı IV. Philippe, bu borçlardan kurtulmak için tarikata 'sapkınlık' suçlaması attı. 13 Ekim 1307 Cuma günü (Cuma ayın 13'ü efsanesinin kökenlerinden biri) tüm şövalyeler tutuklandı ve tarikat lağvedildi. Son Büyük Üstat Jacques de Molay, 1314'te yakılarak idam edildi.",
    "whyItMatters": "Tapınak Şövalyeleri'nin sonu, devlet gücünün (Kral) dini ve ekonomik bir otoriteyi nasıl bir gecede yok edebileceğinin tarihteki en radikal örneğidir.",
    "sources": [
      { "title": "Templars (Britannica)", "url": "https://www.britannica.com/topic/Templars", "type": "official" },
      { "title": "The Fall of the Templars (Yale University Press)", "url": "https://yalebooks.yale.edu/", "type": "academic" }
    ]
  },
  {
    "id": "ghost-samurai-reality",
    "title": "Samuray Savaşı: Düello mu Taktik mi?",
    "subtitle": "Bireysel onur ve toplu imha savaşı.",
    "mediaType": "game",
    "mediaTitle": "Ghost of Tsushima",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Japonya", "Savaş", "Samuray"],
    "isFlagship": false,
    "accuracyType": "partly-real",
    "spoilerLevel": "none",
    "tags": ["ghost-of-tsushima", "samuray", "japonya", "sava"],
    "quickRealityCheck": "Ghost of Tsushima'daki 'teke tek düello' (Standoff) geleneği samuray kültüründe mevcuttu, ancak Moğollar gibi disiplinli bir orduyla karşılaştıklarında bu 'onurlu' yöntemler tam bir askeri intihara dönüştü.",
    "mediaChanged": "Oyun Jin Sakai'nin bu geleneği bozmasını bir 'ahlaki kriz' gibi sunar, oysa gerçek hayatta samuraylar hayatta kalmak için hızla taktik değiştirmiş ve yay kullanımına kılıçtan daha fazla odaklanmışlardır.",
    "realHistory": "13. yüzyıl Japon savaş sanatı, iki savaşçının isimlerini bağırıp birbirini düelloya davet etmesi (meigen) üzerine kuruluydu. Ancak Moğollar, bireysel dövüşe değil, davullarla yönetilen, toplu ok yağmuru ve barutlu bombalar (tetsuhau) kullanan bir 'modern' ordu yapısına sahipti. Japonlar ilk çarpışmalarda ağır kayıplar verince, kılıcı bırakıp atlı okçuluğa ve tahkimat (Mizuki duvarları) kurmaya odaklandılar. Ayrıca, oyundaki katanalar o dönemde henüz icat edilmemişti; samuraylar daha uzun ve kavisli olan 'Tachi' kılıçlarını kullanırlardı.",
    "whyItMatters": "Samurayların dönüşümü, geleneksel askeri değerlerin yeni teknolojiler ve yabancı taktikler karşısında nasıl çöktüğünü gösterir.",
    "sources": [
      { "title": "Samurai (Britannica)", "url": "https://www.britannica.com/topic/samurai", "type": "official" },
      { "title": "Mongol Invasions (The Japan Society)", "url": "https://www.japansociety.org.uk/", "type": "academic" }
    ]
  },
  {
    "id": "kcd-medieval-diet",
    "title": "Orta Çağ’da Ne Yenirdi? (Bohemya 1403)",
    "subtitle": "Ziyafet sofraları ve köylü mutfağının gerçekleri.",
    "mediaType": "game",
    "mediaTitle": "Kingdom Come: Deliverance",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Gündelik Yaşam", "Orta Çağ", "Kültür"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["kingdom-come-deliverance", "orta-cag", "gndelik-yaam", "bohemya"],
    "quickRealityCheck": "Kingdom Come: Deliverance'daki tencerelerde pişen yemekler, Orta Çağ Bohemyası'nın en doğru tarihsel temsillerinden biridir; o dönemde ana öğün et değil, 'pottage' denilen yoğun sebze çorbalarıydı.",
    "mediaChanged": "Filmler genellikle şölenleri devasa kızarmış etlerle gösterir, ancak gerçekte soylular bile taze ete her zaman erişemez, baharatlı ve kurutulmuş gıdaları zenginlik göstergesi olarak kullanırlardı.",
    "realHistory": "1403 Bohemyası'nda halkın %90'ının temel gıdası çavdar ekmeği ve yulaf lapasıydı. Et (özellikle av eti), sadece soyluların ormanlarda avlanma hakkı olduğu için elit bir gıdaydı. Köylüler genellikle tavuk veya domuz eti yerdi ancak bu da bayramlarda veya özel günlerde mümkün olurdu. Şeker henüz Avrupa'ya yayılmadığı için tek tatlandırıcı bal idi. Su genellikle kirli olduğu için hafif alkollü biralar (ale) gün boyunca su niyetine tüketilirdi. Patates, mısır ve domates ise henüz Amerika'dan gelmediği için Avrupa mutfağında kesinlikle yoktu.",
    "whyItMatters": "Beslenme alışkanlıkları, bir toplumun coğrafyası, sınıf yapısı ve teknolojik imkanları hakkında en dürüst bilgiyi veren alandır.",
    "sources": [
      { "title": "Medieval Diet (British Library)", "url": "https://www.bl.uk/the-middle-ages/articles/medieval-food-and-drink", "type": "official" },
      { "title": "Food in Medieval Bohemia (National Museum Prague)", "url": "https://www.nm.cz/en", "type": "museum" }
    ]
  },
  {
    "id": "oppenheimer-trinity-reality",
    "title": "Trinity: İlk Ateşin Lojistiği",
    "subtitle": "Manhattan Projesi'nin final testi.",
    "mediaType": "film",
    "mediaTitle": "Oppenheimer",
    "difficulty": "deep",
    "readingTimeMinutes": 6,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Bilim", "Modern Tarih", "Savaş"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "minor",
    "tags": ["oppenheimer", "atom-bombasi", "modern-tarih", "abd"],
    "quickRealityCheck": "Oppenheimer filmindeki o sessiz bekleyiş gerçektir; Trinity testi 16 Temmuz 1945'te yapıldığında bilim insanları bombanın atmosferi yakıp dünyayı yok edip etmeyeceği konusunda hala bahis oynuyorlardı.",
    "mediaChanged": "Film dramatik olarak patlama anına odaklanır ancak bombanın test alanına taşınması ve montaj süreci (gadget) oyunun yansıttığından çok daha gergin ve manuel bir süreçti.",
    "realHistory": "Trinity testi için New Mexico'daki Jornada del Muerto çölü seçildi. Test edilen 'Gadget', plütonyum çekirdekli bir patlatma (implosion) cihazıydı. Bilim insanları, patlama sonrası radyoaktif serpintinin bölgedeki ineklerin derilerini beyaza çevirdiğini görünce şaşkına dönmüşlerdi. Lojistik olarak, Los Alamos'taki gizli şehirde çalışan binlerce kişi her şeyden habersizdi; sadece birkaç üst düzey yetkili neyin test edildiğini biliyordu. Patlama sonrası ortaya çıkan ısı o kadar yüksekti ki, çöl kumunu 'Trinitit' denilen yeşil radyoaktif cama dönüştürdü. Bu test, atom çağının başlangıcı ve Hiroşima'ya giden son adımdı.",
    "whyItMatters": "Trinity, insanlığın doğa üzerinde daha önce görülmemiş ve geri dönüşü olmayan bir kontrol gücü kazandığı andır.",
    "sources": [
      { "title": "The Trinity Test (Los Alamos National Laboratory)", "url": "https://www.lanl.gov/museum/exhibits/trinity/", "type": "official" },
      { "title": "Manhattan Project (Atomic Heritage Foundation)", "url": "https://www.atomicheritage.org/", "type": "academic" }
    ]
  },
  {
    "id": "chernobyl-biorobots-cost",
    "title": "Çernobil’in Biyo-robotları",
    "subtitle": "Makinelerin bittiği yerde insan bedeni.",
    "mediaType": "series",
    "mediaTitle": "Chernobyl",
    "difficulty": "deep",
    "readingTimeMinutes": 6,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Sovyetler", "Modern Tarih", "Felaket"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "minor",
    "tags": ["chernobyl", "sovyetler", "nukleer-felaket", "modern-tarih"],
    "quickRealityCheck": "Chernobyl dizisindeki 'biyo-robot' sahneleri bir kurgu değil; robotların radyasyondan dolayı devreleri yanınca, çatıdaki grafitleri temizlemek için 60 saniyelik vardiyalarla çalışan binlerce gerçek askerin yaşadığı dramdır.",
    "mediaChanged": "Dizi bu süreci çok hızlı bir sekans gibi geçse de, gerçekte bu operasyon aylarca sürdü ve yaklaşık 600.000 tasfiyeci (liquidator) bu süreçte farklı dozlarda radyasyona maruz kaldı.",
    "realHistory": "Patlama sonrası 4. reaktörün çatısına fırlayan radyoaktif grafitlerin temizlenmesi gerekiyordu. Sovyetler önce Almanya'dan ve Japonya'dan uzaktan kumandalı robotlar getirdi ancak yüksek radyasyon seviyesi robotların elektronik aksamını saniyeler içinde bozdu. Bunun üzerine ordu, yedek askerleri devreye soktu. Kurşun plakalarla kendilerine zırh yapan bu askerlere 'biyo-robotlar' dendi. Her asker çatıya çıkıp tek bir kürek grafit atıyor ve hemen geri dönüyordu. Bu 60-90 saniyelik süre, bir insanın hayatı boyunca alabileceği güvenli radyasyon limitinin çok üzerindeydi. Birçoğu daha sonra ciddi sağlık sorunları yaşadı, ancak Sovyet kayıtları bu ölümleri genellikle gizledi.",
    "whyItMatters": "Tasfiyecilerin fedakarlığı, teknolojik bir felaketin ancak insani bir trajediyle nasıl kontrol altına alınabildiğinin kanıtıdır.",
    "sources": [
      { "title": "Chernobyl Liquidators (IAEA)", "url": "https://www.iaea.org/newscenter/focus/chernobyl", "type": "official" },
      { "title": "The Chernobyl Disaster (World Nuclear Association)", "url": "https://world-nuclear.org/", "type": "official" }
    ]
  },
  {
    "id": "gladiator-commodus-real",
    "title": "Gladyatör İmparator: Commodus",
    "subtitle": "Roma'nın çöküşünü başlatan narsisizm.",
    "mediaType": "film",
    "mediaTitle": "Gladiator",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Roma", "Biyografi", "Siyaset"],
    "isFlagship": false,
    "accuracyType": "partly-real",
    "spoilerLevel": "minor",
    "tags": ["gladiator", "roma", "biyografi", "tarih"],
    "quickRealityCheck": "Gladiator filmindeki Commodus bir piskopat gibi resmedilir, ancak gerçek Commodus kendisini Herkül'ün reenkarnasyonu sanan ve bizzat arenaya inip gladyatörlerle (zayıflatılmış rakiplerle) dövüşen bir narsistti.",
    "mediaChanged": "Filmde Commodus arenada Maximus tarafından öldürülür. Gerçekte ise bir banyoda güreşçisi Narcissus tarafından boğularak suikasta kurban gitmiştir ve saltanatı 12 yıl sürmüştür (filmdeki gibi birkaç gün değil).",
    "realHistory": "Babası bilge Marcus Aurelius'un ardından tahta geçen Commodus, Roma'nın 'Beş İyi İmparator' dönemini bitirdi. Yönetimle ilgilenmek yerine vaktini arenada hayvan öldürerek ve gladyatör dövüşleri yaparak geçiriyordu. Roma halkına kendisini yarı-tanrı olarak kabul ettirmeye çalıştı ve şehrin ismini 'Colonia Commodiana' olarak değiştirdi. Ekonomiyi saray harcamalarıyla iflasa sürükledi. Arenaya her inişinde devlet hazinesinden kendine devasa ödemeler yapıyordu. Onun ölümü, Roma'da 'Beş İmparator Yılı' denilen büyük bir iç savaşa ve imparatorluğun yapısal çöküşünün başlangıcına neden oldu.",
    "whyItMatters": "Commodus, bir imparatorluğun zirvedeyken kötü bir liderlik yüzünden ne kadar hızla uçuruma sürüklenebileceğinin en somut örneğidir.",
    "sources": [
      { "title": "Commodus (Britannica)", "url": "https://www.britannica.com/biography/Commodus", "type": "official" },
      { "title": "The Decline and Fall of the Roman Empire (Gibbon)", "url": "https://www.gutenberg.org/", "type": "academic" }
    ]
  }
];

// 3. New Flagships (Guided Journey Content)
const newFlagships = [
  {
    "id": "got-war-of-roses-real",
    "title": "Güllerin Savaşı: Westeros’un Gerçek İlhamı",
    "subtitle": "Lannister ve Stark hanedanlarının arkasındaki kanlı İngiliz tarihi.",
    "mediaType": "series",
    "mediaTitle": "Game of Thrones",
    "difficulty": "deep",
    "readingTimeMinutes": 12,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Orta Çağ", "İngiltere", "Siyaset"],
    "isFlagship": true,
    "accuracyType": "inspired-by-reality",
    "spoilerLevel": "none",
    "tags": ["game-of-thrones", "ingiltere", "orta-cag", "gullerin-savasi"],
    "quickRealityCheck": "Westeros'taki Lannister ve Stark savaşı, 15. yüzyıl İngilteresi'nde York ve Lancaster hanedanları arasında geçen ve 'Güllerin Savaşı' olarak bilinen 30 yıllık gerçek bir taht mücadelesinden esinlenmiştir.",
    "mediaChanged": "George R.R. Martin ejderhalar ve ak yürüyenler eklese de, Red Wedding (Kara Akşam Yemeği) ve Joffrey'nin zalimliği gibi olayların birebir tarihi karşılıkları bulunmaktadır.",
    "realHistory": "### Hanedan Çatışması: York vs. Lancaster\n\nGame of Thrones'daki 'Lannister' ve 'Stark' isimleri bile tesadüf değildir. Lancaster (Kırmızı Gül) ve York (Beyaz Gül) hanedanları, İngiltere tahtı için birbirlerini on yıllarca kırmışlardır. Starklar gibi Yorklar da kuzeyin güçlü aileleriydi ve dürüstlükleriyle (ancak siyasi safdillikleriyle) bilinirlerdi. Lannisterlar gibi Lancasterlar ise saraya ve hazineye daha yakındı.\n\n### Deli Kral ve Çocuk Hükümdarlar\n\nMad King Aerys'in karşılığı, akli dengesi yerinde olmayan İngiltere Kralı VI. Henry idi. Onun yönetemediği devlet, hırslı eşi Anjou'lu Margaret (Cersei Lannister'ın ilham kaynağı) tarafından idare ediliyordu. Joffrey Baratheon karakteri ise, Margaret'ın acımasız ve dengesiz oğlu Galler Prensi Edward'dan esinlenilmiştir; Edward'ın da tıpkı Joffrey gibi esirleri idam etmekten zevk aldığı söylenir.\n\n### Kara Akşam Yemeği: Gerçek Kızıl Düğün\n\nGame of Thrones'un en travmatik anı olan Kızıl Düğün, İskoç tarihindeki iki gerçek olaya dayanır: 'Kara Akşam Yemeği' (1440) ve 'Glencoe Katliamı' (1692). Kara Akşam Yemeği'nde, güçlü Douglas klanının genç liderleri bir ziyafete davet edilmiş, yemek sırasında önlerine siyah bir boğa başı (ölüm sembolü) konulmuş ve ardından hepsi katledilmiştir. Misafirperverlik yasalarının çiğnenmesi, Orta Çağ toplumunda tıpkı dizideki gibi en büyük günah sayılmıştır.\n\n### Duvar ve Hadrian: Kuzeyin Sınırı\n\nWesteros'un kuzeyindeki devasa buz duvarı, Roma İmparatoru Hadrian'ın İngiltere'nin kuzeyine inşa ettirdiği 'Hadrian Duvarı'nın fantastik bir versiyonudur. Roma, 'barbar' kabileleri (Yabanılları) dışarıda tutmak için bu sınırı inşa etmişti. George R.R. Martin, bu duvarı ziyaret ettiğinde 'burada nöbet tutan bir Romalı askerin neler hissettiğini' düşünerek Gece Nöbeti (Night's Watch) fikrini geliştirmiştir.\n\n### Neden Önemli?\n\nGame of Thrones'un bu kadar gerçekçi hissettirmesinin nedeni, insan doğasının güç, ihanet ve hayatta kalma güdülerinin tarihte defalarca aynı şekilde tezahür etmiş olmasıdır. Fantezi unsurları sadece bu evrensel gerçekleri daha büyük bir ölçekte görmemizi sağlar.",
    "whyItMatters": "Kurgu ve tarihin bu kadar iç içe geçmesi, geçmişin aslında ne kadar 'fantastik' ve acımasız olabileceğini hatırlatır.",
    "sources": [
      { "title": "Wars of the Roses (Britannica)", "url": "https://www.britannica.com/event/Wars-of-the-Roses", "type": "official" },
      { "title": "The Real Game of Thrones (History Extra)", "url": "https://www.historyextra.com/period/medieval/the-real-game-of-thrones/", "type": "academic" }
    ]
  },
  {
    "id": "shogun-tokugawa-rise-real",
    "title": "Tokugawa’nın Doğuşu: Toranaga’nın Gerçek Dehası",
    "subtitle": "Sekigahara'dan 250 yıllık barışa giden yol.",
    "mediaType": "series",
    "mediaTitle": "Shōgun",
    "difficulty": "deep",
    "readingTimeMinutes": 14,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Japonya", "Samuray", "Siyaset"],
    "isFlagship": true,
    "accuracyType": "real",
    "spoilerLevel": "minor",
    "tags": ["shogun", "japonya", "tokugawa", "samuray"],
    "quickRealityCheck": "Shōgun dizisindeki Lord Yoshii Toranaga, Japonya'nın en önemli tarihi figürlerinden biri olan Tokugawa Ieyasu'nun birebir yansımasıdır; Ieyasu sadece bir savaşçı değil, düşmanlarını sabırla bekleyerek yok eden bir siyasi dehaydı.",
    "mediaChanged": "Dizi olayları daha kısa bir zaman dilimine sığdırsa da, Toranaga'nın (Ieyasu) Anjin (William Adams) ile olan ilişkisi ve beşli konsey içindeki satranç hamleleri büyük oranda gerçek belgelere dayanır.",
    "realHistory": "### Sabrın Gücü: Ieyasu’nun Felsefesi\n\nJaponya'nın 'Üç Büyük Birleştiricisi' arasında Ieyasu sabrıyla bilinirdi. Meşhur bir şiirde denildiği gibi: Nobunaga 'Eğer kuş ötmezse onu öldürürüm' derdi, Hideyoshi 'Eğer kuş ötmezse onu öttürürüm' derdi, Ieyasu ise 'Eğer kuş ötmezse ötmesini beklerim' derdi. Shōgun dizisindeki Toranaga tam olarak bu bekleyişin ve stratejinin temsilcisidir.\n\n### Anjin: William Adams’ın Gerçek Hikayesi\n\nJohn Blackthorne karakteri, 1600 yılında Japonya kıyılarına vuran İngiliz denizci William Adams'dır. Ieyasu, Adams'ın bilgisini (matematik, gemi inşası, haritacılık) fark etmiş ve onu asla geri göndermemiştir. Ona bir samuray unvanı, iki kılıç ve 'Miura Anjin' (Miura'nın kılavuzu) ismini vermiştir. Adams, Ieyasu'nun dış dünyaya açılan penceresi ve en güvendiği danışmanlarından biri olmuştur.\n\n### Sekigahara: Kaderin Belirlendiği An\n\nShōgun dizisinin (ve gerçek tarihin) doruk noktası Sekigahara Savaşı'dır. 1600 yılında gerçekleşen bu savaş, Japonya tarihinin en büyük samuray çarpışmasıdır. Ieyasu, sayısal olarak dezavantajlı olmasına rağmen, karşı taraftaki bazı lordları savaşın tam ortasında taraf değiştirmeye ikna ederek (siyasi manipülasyonla) kesin bir zafer kazanmıştır. Bu zafer, 1868'e kadar sürecek olan Tokugawa Şogunluğu'nun başlangıcı olmuştur.\n\n### Edo: Balıkçı Kasabasından Metropole\n\nIeyasu, başkent Kyoto'dan uzaklaşarak stratejik bir karar verdi ve merkezini bataklık bir balıkçı kasabası olan Edo'ya taşıdı. Zorunlu ikamet sistemi (Sankin-kotai) ile tüm lordları burada toplaması, Edo'yu dünyanın en büyük şehirlerinden birine dönüştürdü. Bugünün Tokyo'sunun temelleri, Ieyasu'nun bu 'güvenlik odaklı' şehir planlamasıyla atılmıştır.\n\n### Neden Önemli?\n\nTokugawa Ieyasu'nun kurduğu düzen, Japonya'yı iç savaşlardan kurtarıp 250 yıl sürecek kesintisiz bir barış ve kültürel patlama (Edo Dönemi) dönemine sokmuştur. Shōgun dizisi, bu devasa barışın ne kadar kanlı ve zorlu bir süreçle kurulduğunu anlamamızı sağlar.",
    "whyItMatters": "Ieyasu'nun hayatı, askeri gücün ancak doğru siyasi zeka ve sabırla birleştiğinde kalıcı bir medeniyet kurabileceğini gösterir.",
    "sources": [
      { "title": "Tokugawa Ieyasu (Britannica)", "url": "https://www.britannica.com/biography/Tokugawa-Ieyasu", "type": "official" },
      { "title": "William Adams: The First Samurai (History Today)", "url": "https://www.historytoday.com/", "type": "academic" }
    ]
  }
];

// 4. Update Function
cards.forEach(card => {
  if (enrichments[card.id]) {
    Object.assign(card, enrichments[card.id]);
  }
});

const updatedCards = [...cards, ...newCards, ...newFlagships];

// Deduplicate by ID just in case
const finalCards = Array.from(new Map(updatedCards.map(c => [c.id, c])).values());

fs.writeFileSync('data/cards.json', JSON.stringify(finalCards, null, 2));

console.log(`Updated cards.json: ${cards.length} existing cards (7 enriched), ${newCards.length} new standard cards added, ${newFlagships.length} new flagships added. Total: ${finalCards.length}`);
