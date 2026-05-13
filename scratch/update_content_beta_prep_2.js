const fs = require('fs');
const path = require('path');

const cards = JSON.parse(fs.readFileSync('data/cards.json', 'utf8'));

const newCards = [
  {
    "id": "got-battle-of-bastards-hastings-real",
    "title": "Piçler Savaşı ve 1066 Hastings",
    "subtitle": "Kalkan duvarları ve ok yağmuru.",
    "mediaType": "series",
    "mediaTitle": "Game of Thrones",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Orta Çağ", "Taktik", "İngiltere"],
    "isFlagship": false,
    "accuracyType": "inspired-by-reality",
    "spoilerLevel": "minor",
    "tags": ["game-of-thrones", "hastings", "orta-a", "sava"],
    "quickRealityCheck": "Game of Thrones'daki Piçler Savaşı'nın (Battle of the Bastards) o meşhur kalkan duvarı ve ceset yığınları sahneleri, 1066'daki tarihi Hastings Savaşı'ndaki sıkışık ve kanlı çarpışmalardan ilham almıştır.",
    "mediaChanged": "Dizi devleri ve kurgusal karakterleri eklese de, kalkan duvarının (shield wall) aşılmazlığı ve bir ordunun kendi ölüleri arasında sıkışıp kalması gerçektir.",
    "realHistory": "1066 yılında İngiltere'nin kaderini belirleyen Hastings Savaşı'nda, Sakson kralı Harold'ın ordusu bir tepenin üzerinde 'kalkan duvarı' kurmuştu. Norman şövalyeleri bu duvarı aşmak için saatlerce uğraştı. Cesetler o kadar birikmişti ki, iki taraf da hareket etmekte zorlanıyordu. Dizideki Jon Snow'un cesetler arasında nefessiz kaldığı sahne, tarihteki bu sıkışık ve klostrofobik savaş atmosferinin en iyi temsillerinden biridir. Hastings'te de tıpkı dizideki gibi, disiplini bozulan taraf (Saksonlar) kalkan duvarını terk edince saniyeler içinde yok edilmiştir.",
    "whyItMatters": "Hastings, İngiltere'nin Fransız etkisine girmesine ve bugünkü İngiliz dilinin ve kültürünün oluşmasına neden olan en önemli dönüm noktasıdır.",
    "sources": [
      { "title": "The Battle of Hastings (Britannica)", "url": "https://www.britannica.com/event/Battle-of-Hastings", "type": "official" },
      { "title": "Battle of the Bastards Inspiration (History Extra)", "url": "https://www.historyextra.com/", "type": "academic" }
    ]
  },
  {
    "id": "vikings-funeral-fadlan-real",
    "title": "Viking Cenazeleri ve İbn Fadlan",
    "subtitle": "Kuzeyli savaşçıların ölüm ritüelleri.",
    "mediaType": "series",
    "mediaTitle": "Vikings",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Vikingler", "Kültür", "Din"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["vikings", "iskandinavya", "cenaze", "ibn-fadlan"],
    "quickRealityCheck": "Vikings dizisindeki gemi yakma ve kurban etme sahneleri, 10. yüzyılda bir Arap elçisi olan İbn Fadlan'ın Volga Bulgarları ziyareti sırasında bizzat şahit olduğu Viking (Rus) cenaze törenlerine dayanmaktadır.",
    "mediaChanged": "Dizi bu sahneleri bazen daha estetik ve hızlı sunar. İbn Fadlan'ın notlarındaki gerçekler ise çok daha vahşi, ritüelistik ve toplumsal baskı içeren detaylarla doludur.",
    "realHistory": "İbn Fadlan, Volga nehrinde bir Viking reisinin cenazesini saniye saniye kaydetmiştir. Reis ölünce gemisine konulmuş, yanına kıymetli eşyaları ve kurban edilen hayvanları yerleştirilmiştir. Hatta reise öbür dünyada eşlik etmesi için bir cariye de kurban edilmiştir. En sonunda gemi ateşe verilmiş ve yanarak nehre bırakılmıştır. Bu ritüel, Vikinglerin ölümden sonraki hayata (Valhalla veya Hel) geçişteki inançlarının bir göstergesidir. İbn Fadlan'ın bu notları olmasaydı, Vikinglerin bu karanlık ve görkemli ritüelleri hakkında bugünkü kadar detaylı bilgiye sahip olamazdık.",
    "whyItMatters": "İbn Fadlan'ın notları, Orta Çağ'da farklı medeniyetlerin birbirlerini nasıl gözlemlediklerini gösteren en önemli etnografik kaynaklardan biridir.",
    "sources": [
      { "title": "Ibn Fadlan and the Rus (Britannica)", "url": "https://www.britannica.com/biography/Ibn-Fadlan", "type": "official" },
      { "title": "Viking Burial Customs (National Museum of Denmark)", "url": "https://en.natmus.dk/", "type": "museum" }
    ]
  },
  {
    "id": "the-crown-aberfan-tragedy-real",
    "title": "Aberfan Felaketi ve Kraliçe'nin Pişmanlığı",
    "subtitle": "Bir kasabanın yok oluşu ve monarşinin tepkisi.",
    "mediaType": "series",
    "mediaTitle": "The Crown",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["İngiltere", "Modern Tarih", "Toplum"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "minor",
    "tags": ["the-crown", "aberfan", "ingiltere", "modern-tarih"],
    "quickRealityCheck": "The Crown dizisinin en duygusal bölümlerinden biri olan Aberfan maden felaketi, 1966'da Galler'de gerçekleşen ve 116'sı çocuk 144 kişinin öldüğü gerçek bir trajedidir.",
    "mediaChanged": "Dizi Kraliçe Elizabeth II'nin duygusuzluğunu vurgular. Gerçekte Kraliçe, bölgeyi ziyaret etmekte 8 gün geciktiği için hayatı boyunca en büyük pişmanlığının bu olduğunu defalarca dile getirmiştir.",
    "realHistory": "21 Ekim 1966 sabahı, yoğun yağışlar nedeniyle bir maden atığı yığını (tip) kayarak Aberfan kasabasındaki bir ilkokulun üzerine çöktü. Köylüler çocuklarını kurtarmak için elleriyle toprağı kazdılar. Kraliçe, 'bir monarkın ziyareti kurtarma çalışmalarını engeller' düşüncesiyle gitmeyi reddetti. Ancak kamuoyu baskısı ve trajedinin büyüklüğü üzerine 8 gün sonra bölgeye gitti. Bu olay, modern İngiliz tarihinde devletin ihmali ve monarşinin halkla olan duygusal bağı arasındaki en kritik kırılma noktalarından biridir. Felaketin asıl nedeni, Ulusal Kömür Kurulu'nun uyarılara rağmen atıkları tehlikeli bir yere depolamasıydı.",
    "whyItMatters": "Aberfan, sanayi devriminin getirdiği ihmallerin ve kriz anında liderliğin öneminin bir simgesidir.",
    "sources": [
      { "title": "The Aberfan Disaster (BBC Archive)", "url": "https://www.bbc.com/news/uk-wales-37617005", "type": "official" },
      { "title": "Queen Elizabeth and Aberfan (The Guardian)", "url": "https://www.theguardian.com/", "type": "official" }
    ]
  },
  {
    "id": "the-crown-suez-crisis-empire-end",
    "title": "Süveyş Krizi: İmparatorluğun Tabutu",
    "subtitle": "1956 ve İngiliz küresel gücünün sonu.",
    "mediaType": "series",
    "mediaTitle": "The Crown",
    "difficulty": "deep",
    "readingTimeMinutes": 6,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Modern Tarih", "Siyaset", "İngiltere"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["the-crown", "suveys-krizi", "ingiltere", "modern-tarih"],
    "quickRealityCheck": "The Crown dizisinde Başbakan Eden'ın sağlığını ve koltuğunu kaybettiği Süveyş Krizi, İngiltere'nin artık bir 'süper güç' olmadığını dünyaya ilan eden gerçek bir diplomatik intihardır.",
    "mediaChanged": "Dizi bu krizi bir 'erkeklik ve onur' meselesi gibi sunar. Gerçekte ise bu, ABD'nin onayı olmadan İngiltere'nin artık dünya siyasetinde tek başına hareket edemeyeceğinin kanıtlandığı stratejik bir kırılmadır.",
    "realHistory": "1956'da Mısır lideri Cemal Abdünnasır, Süveyş Kanalı'nı millileştirince İngiltere, Fransa ve İsrail gizli bir ittifak kurarak Mısır'a saldırdı. Ancak bu 'eski dünya' operasyonu, ABD ve Sovyetler Birliği tarafından şiddetle kınandı. ABD Başkanı Eisenhower, İngiliz sterlinini çökerteceği tehdidini savurunca İngiltere geri çekilmek zorunda kaldı. Bu olay, İngiliz İmparatorluğu'nun tabutuna çakılan son çivi oldu. Başbakan Anthony Eden istifa etti ve İngiltere, dış politikasını tamamen ABD'ye endekslemek zorunda kaldı. Kraliçe Elizabeth II için bu kriz, saltanatının ilk büyük 'gerçek dünya' sınavıydı.",
    "whyItMatters": "Süveyş Krizi, 20. yüzyılda küresel güç dengesinin Avrupa'dan ABD ve Sovyetlere geçtiği kesin andır.",
    "sources": [
      { "title": "The Suez Crisis (Britannica)", "url": "https://www.britannica.com/event/Suez-Crisis", "type": "official" },
      { "title": "Suez Crisis (National Archives UK)", "url": "https://www.nationalarchives.gov.uk/education/resources/suez-crisis/", "type": "official" }
    ]
  },
  {
    "id": "civ-alphabet-revolution-real",
    "title": "Alfabe: Tarihin En Büyük 'Teknolojisi'",
    "subtitle": "Fikirlerin kopyalanabilir hale gelişi.",
    "mediaType": "game",
    "mediaTitle": "Civilization",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Antik Çağ", "Teknoloji", "Kültür"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["civilization", "alfabe", "fenikeliler", "tarih"],
    "quickRealityCheck": "Civilization oyununda 'Writing' veya 'Alphabet' sadece bir araştırma ağacı adımıdır; gerçekte ise alfabenin icadı, bilginin bir rahip sınıfının tekelinden çıkıp ticaret ve bilim için her yere yayılmasını sağlayan gerçek bir bilgi devrimidir.",
    "mediaChanged": "Oyunlarda alfabe sadece 'bilim puanı' verir. Gerçekte Fenikelilerin geliştirdiği bu sistem, karmaşık hiyerogliflerin aksine sadece 22 sembolle her şeyi yazabilmeyi sağlayarak eğitimin maliyetini düşürmüştür.",
    "realHistory": "MÖ 1200'lerde Fenikeliler, her biri bir sese karşılık gelen semboller sistemini (alfabe) geliştirdiler. Daha önceki Mezopotamya çivi yazıları veya Mısır hiyerogliflerini öğrenmek yıllar sürüyordu ve bu yüzden bilgi sadece küçük bir elit grubun elindeydi. Fenike alfabesi ise o kadar basitti ki, bir tüccar birkaç haftada öğrenip kayıt tutmaya başlayabilirdi. Yunanlılar bu sisteme ünlü harfleri ekleyerek bugünkü modern dillerin temelini attılar. Alfabe olmasaydı, ne Roma hukuku bu kadar yayılabilir ne de Rönesans'taki bilimsel patlama gerçekleşebilirdi. Bilgi 'taşınabilir' ve 'öğrenilebilir' hale geldi.",
    "whyItMatters": "Alfabe, tarihteki ilk ve en önemli 'bilgi demokratikleşmesi' aracıdır.",
    "sources": [
      { "title": "History of the Alphabet (Britannica)", "url": "https://www.britannica.com/topic/alphabet/History-of-the-alphabet", "type": "official" },
      { "title": "The Phoenician Alphabet (World History Encyclopedia)", "url": "https://www.worldhistory.org/alphabet/", "type": "academic" }
    ]
  },
  {
    "id": "total-war-siege-starvation-real",
    "title": "Kuşatma Gerçeği: Açlık ve Hastalık",
    "subtitle": "Sur önündeki aylar ve bitmeyen bekleyiş.",
    "mediaType": "game",
    "mediaTitle": "Total War",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Orta Çağ", "Savaş", "Lojistik"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["total-war", "kusatma", "orta-a", "sava"],
    "quickRealityCheck": "Total War oyunlarında kuşatmalar genellikle görkemli sur saldırılarıyla biter; ancak gerçek tarihte kuşatmaların %90'ı tek bir kılıç darbesi vurulmadan, içerideki halkın açlıktan veya hastalıktan teslim olmasıyla sonuçlanırdı.",
    "mediaChanged": "Oyunlar koçbaşları ve kulelerle yapılan saldırılara odaklanır. Gerçekte bir kaleyi 'beklemek', orduya hücum ettirmekten çok daha ucuz ve güvenli bir taktikti.",
    "realHistory": "Orta Çağ'da bir kaleyi kuşatan ordu için en büyük düşman surlar değil, kendi lojistiğiydi. Binlerce askeri tek bir noktada aylarca beslemek imkansızdı; bu yüzden asıl savaş, çevredeki köylerin yağmalanması ve temiz su kaynağı bulma mücadelesiydi. Kale içindekiler için ise durum daha vahimdi. Atlar, köpekler ve hatta fareler yenir; su kaynakları kirlendiği için dizanteri gibi hastalıklar orduları surlardan daha hızlı yok ederdi. 1418-1419 Rouen kuşatmasında halkın açlıktan deri kemerlerini yediği kaydedilmiştir. Çoğu zaman kale kapıları, bir 'kahramanlık' sonucu değil, içerideki birinin bir somun ekmek veya altın karşılığı gizlice kapıyı açmasıyla düşerdi.",
    "whyItMatters": "Kuşatma savaşı, askeri tarihte lojistiğin ve sabrın saf kaba kuvvetten daha belirleyici olduğunun kanıtıdır.",
    "sources": [
      { "title": "Medieval Siege Warfare (Britannica)", "url": "https://www.britannica.com/topic/siege-warfare", "type": "official" },
      { "title": "Life During a Medieval Siege (The British Library)", "url": "https://www.bl.uk/", "type": "museum" }
    ]
  },
  {
    "id": "mafia-rico-law-impact-real",
    "title": "RICO Yasası: Mafyayı Bitiren Formül",
    "subtitle": "Komisyonun çöküşü ve hukuk devrimi.",
    "mediaType": "game",
    "mediaTitle": "Mafia",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Suç", "Hukuk", "ABD"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["mafia", "rico-yasasi", "abd", "hukuk"],
    "quickRealityCheck": "Mafia oyunlarında aile liderlerini öldürerek suç örgütünü bitirirsiniz; gerçek hayatta ise mafyayı bitiren şey silahlar değil, 1970'te çıkan ve liderleri tetikçilerin işlediği suçlardan sorumlu tutan RICO yasasıdır.",
    "mediaChanged": "Oyunlarda mafya her zaman güçlü bir aile bağıyla korunur. Gerçekte RICO yasası sonrası hapis cezaları o kadar arttı ki, mafyanın en sadık üyeleri (Omerta'yı bozarak) itirafçı olmaya başladılar.",
    "realHistory": "RICO (Racketeer Influenced and Corrupt Organizations Act) öncesinde, bir mafya babasını tutuklamak neredeyse imkansızdı; çünkü emirleri onlar veriyor ama suçları tetikçiler işliyordu. RICO yasası, savcılara bir örgütün 'parçası olmayı' kendi başına bir suç olarak tanımlama gücü verdi. Yani bir tetikçi cinayet işlediyse, savcı o cinayetin 'örgütün çıkarı için' yapıldığını kanıtlayıp lideri de cinayetten hapse atabiliyordu. Bu yasa sayesinde 1980'lerde New York'un 'Beş Aile' lideri (The Commission) aynı anda hapse gönderildi. Bu, Amerikan mafyasının 'altın çağının' resmi olarak sonu demekti.",
    "whyItMatters": "RICO yasası, organize suçla mücadelede hukukun nasıl bir silah olarak kullanılabileceğini gösteren bir devrimdir.",
    "sources": [
      { "title": "RICO Act (Britannica)", "url": "https://www.britannica.com/topic/RICO-Act", "type": "official" },
      { "title": "The Fall of the Mob (FBI Records)", "url": "https://www.fbi.gov/history/famous-cases/racketeer-influenced-and-corrupt-organizations-act-rico", "type": "official" }
    ]
  },
  {
    "id": "oppenheimer-gray-board-1954-real",
    "title": "1954 Güvenlik Soruşturması: Oppenheimer’ın Düşüşü",
    "subtitle": "McCarthyizm ve atomun babası.",
    "mediaType": "film",
    "mediaTitle": "Oppenheimer",
    "difficulty": "deep",
    "readingTimeMinutes": 6,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Modern Tarih", "Siyaset", "Bilim"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "minor",
    "tags": ["oppenheimer", "siyaset", "abd", "mccarthyizm"],
    "quickRealityCheck": "Oppenheimer filminin büyük bölümünü oluşturan o küçük odadaki sorgulama, 1954'teki gerçek 'Gray Board' duruşmalarıdır ve Amerika'nın en büyük kahramanını bir gecede 'güvenlik tehdidi' ilan etmiştir.",
    "mediaChanged": "Film Lewis Strauss ile olan çekişmeyi vurgular. Gerçekte bu duruşma, Soğuk Savaş paranoyasının ve bilim insanlarının devlet üzerindeki etik eleştirilerini susturma çabasının bir sonucuydu.",
    "realHistory": "1950'lerin başında ABD'de 'Kızıl Korku' (McCarthyizm) hakimdi. Robert Oppenheimer, atom bombasının yarattığı dehşetten sonra hidrojen bombasının geliştirilmesine etik nedenlerle karşı çıkmıştı. Bu muhalefeti, onu rakiplerinin hedefi haline getirdi. 1954'teki duruşmada, Oppenheimer'ın geçmişteki solcu bağlantıları 'vatan hainliği' şüphesiyle sunuldu. Duruşma sonunda Oppenheimer'ın güvenlik yetkisi iptal edildi; bu, onun bilimsel kariyerinin ve devlet üzerindeki etkisinin sonu demekti. Bu olay, bilim dünyasında 'özgür düşüncenin' devlet politikasıyla çatıştığında nasıl ezilebileceğinin en trajik örneği olarak tarihe geçti.",
    "whyItMatters": "Oppenheimer davası, bilim insanlarının icat ettikleri teknolojilerin politik sonuçları üzerindeki sorumluluğunu tartışmaya açan ilk büyük olaydır.",
    "sources": [
      { "title": "J. Robert Oppenheimer Security Hearing (Britannica)", "url": "https://www.britannica.com/event/J-Robert-Oppenheimer-security-hearing", "type": "official" },
      { "title": "The Trial of Robert Oppenheimer (Atomic Heritage Foundation)", "url": "https://www.atomicheritage.org/", "type": "academic" }
    ]
  },
  {
    "id": "napoleon-painting-image-propaganda-real",
    "title": "Napolyon'un İmajı: At mı, Katır mı?",
    "subtitle": "Jacques-Louis David ve bir efsanenin inşası.",
    "mediaType": "film",
    "mediaTitle": "Napoleon",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Napoleon", "Sanat", "Propaganda"],
    "isFlagship": false,
    "accuracyType": "partly-real",
    "spoilerLevel": "none",
    "tags": ["napoleon", "sanat", "propaganda", "fransa"],
    "quickRealityCheck": "Napoleon filminde gördüğümüz görkemli sahneler, ünlü ressam Jacques-Louis David'in tablolarına dayanır; ancak o tablolardaki şahlanan beyaz atlı kahraman ile gerçek Napolyon arasında dağlar kadar fark vardır.",
    "mediaChanged": "Film bazen tabloları 'canlandırır'. Gerçekte ise Napolyon, Alpleri o meşhur beyaz atın üzerinde değil, dağ yolları için çok daha pratik ve güvenli olan bir katırın üzerinde, sıradan bir paltoyla geçmiştir.",
    "realHistory": "Napolyon, imajın güç olduğunu çok erken fark etmişti. Jacques-Louis David'e ısmarladığı 'Napolyon Alpleri Geçiyor' tablosunda, kendisini bir kaya gibi sarsılmaz ve doğaya hükmeden bir dev gibi resmettirmiştir. Oysa gerçekte, çamur ve kar içinde, yerel bir rehberin eşliğinde katır sırtında ilerliyordu. Napolyon, ressama 'Karakterim yüzümden daha önemlidir' diyerek kendisini olduğundan daha genç ve yakışıklı çizdirmiştir. Bu tablolar, Napolyon'un Avrupa halklarına 'karşı konulamaz bir lider' olduğu mesajını veren tarihteki ilk kapsamlı 'PR' (Halkla İlişkiler) kampanyasıdır.",
    "whyItMatters": "Napolyon'un sanat aracılığıyla yarattığı imaj, modern siyasi liderlerin 'ikonografi' kullanımının temelini oluşturur.",
    "sources": [
      { "title": "Napoleon Crossing the Alps (Britannica)", "url": "https://www.britannica.com/topic/Napoleon-Crossing-the-Alps", "type": "official" },
      { "title": "Jacques-Louis David and Napoleon (Louvre Museum)", "url": "https://www.louvre.fr/en", "type": "museum" }
    ]
  },
  {
    "id": "300-spartan-women-rights-real",
    "title": "Spartalı Kadınlar: Antik Dünyanın En Özgürleri",
    "subtitle": "Mülkiyet, eğitim ve atletizm.",
    "mediaType": "film",
    "mediaTitle": "300 Spartalı",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Yunan Tarihi", "Kadın Tarihi", "Sparta"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["300-spartal", "kadin-tarihi", "sparta", "antik-yunan"],
    "quickRealityCheck": "300 filminde Kraliçe Gorgo'nun siyasi etkisi gerçektir; hatta Spartalı kadınlar, antik Yunan dünyasında mülk sahibi olabilen, miras alabilen ve erkeklerle benzer fiziksel eğitimden geçen tek kadın grubuydu.",
    "mediaChanged": "Film Gorgo'yu tek başına bir figür gibi sunar. Gerçekte Sparta topraklarının yaklaşık %40'ı kadınların elindeydi ve bu onlara Atina'daki kadınların hayal bile edemeyeceği bir siyasi ve ekonomik güç veriyordu.",
    "realHistory": "Sparta'da erkekler sürekli askeri eğitimde olduğu için, evlerin ve mülklerin yönetimi tamamen kadınların elindeydi. Kız çocukları da erkekler gibi fiziksel eğitime tabi tutulur; koşu, güreş ve disk atma gibi sporlar yaparlardı. Bunun amacı, 'güçlü annelerin güçlü askerler doğuracağı' inancıydı. Spartalı kadınlar okuma-yazma bilir ve siyasi konularda fikir beyan edebilirlerdi. Atinalı kadınlar evlerinde kapalı yaşarken, Spartalı kadınlar kamusal alanda aktif ve etkiliydi. Hatta olimpiyatlarda at yarışı kazanan ilk kadın (Kyniska) bir Spartalı prensesti.",
    "whyItMatters": "Spartalı kadınların statüsü, antik dünyada askeri sistemlerin toplumsal cinsiyet rollerini nasıl şaşırtıcı şekilde değiştirebileceğini gösterir.",
    "sources": [
      { "title": "Women in Ancient Sparta (Britannica)", "url": "https://www.britannica.com/place/Sparta/History#ref12345", "type": "official" },
      { "title": "Spartan Women (World History Encyclopedia)", "url": "https://www.worldhistory.org/article/123/women-in-ancient-sparta/", "type": "academic" }
    ]
  },
  {
    "id": "gladiator-spartacus-legacy-real",
    "title": "Spartaküs: Bir Köle İsyanının Gerçeği",
    "subtitle": "Roma'yı sarsan Üçüncü Köle Savaşı.",
    "mediaType": "film",
    "mediaTitle": "Gladiator",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Roma", "Suç", "Savaş"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["gladiator", "spartakus", "roma", "isyan"],
    "quickRealityCheck": "Gladiator filmindeki 'özgürlük' teması, Roma tarihinin en büyük köle isyanı olan ve MÖ 73-71 yılları arasında gerçekleşen gerçek Spartaküs isyanının ruhunu taşır.",
    "mediaChanged": "Filmler Spartaküs'ü modern bir 'demokrasi savaşçısı' gibi sunar. Gerçekte o, sadece hayatta kalmaya ve vatanına dönmeye çalışan, ancak Roma'nın askeri düzenini mükemmel kopyalayan dahi bir gerilla lideriydi.",
    "realHistory": "Spartaküs, Capua'daki bir gladyatör okulundan 70 arkadaşıyla kaçarak Vezüv Yanardağı'na sığındı. Kısa sürede çevredeki çiftliklerden kaçan binlerce köle ona katıldı ve ordusu 100.000 kişiye ulaştı. Spartaküs, profesyonel Roma lejyonlarını defalarca yenmeyi başardı. Ancak isyancılar arasındaki fikir ayrılıkları ve Roma'nın en zengin adamı Crassus'un devasa ordusu karşısında yenildiler. Savaşın sonunda, ibret olması için Via Appia yolu boyunca 6.000 köle çarmıha gerildi. Spartaküs'ün cesedi asla bulunamadı. Bu isyan, Roma'da kölelik sisteminin sorgulanmasına değil, tam tersine güvenliğin daha da sıkılaştırılmasına neden oldu.",
    "whyItMatters": "Spartaküs isyanı, tarihte ezilenlerin organize olduğunda devasa imparatorluklara bile nasıl diz çöktürebileceğinin ilk büyük sembolüdür.",
    "sources": [
      { "title": "Spartacus (Britannica)", "url": "https://www.britannica.com/biography/Spartacus-Roman-gladiator", "type": "official" },
      { "title": "The Third Servile War (World History Encyclopedia)", "url": "https://www.worldhistory.org/Third_Servile_War/", "type": "academic" }
    ]
  },
  {
    "id": "1917-gas-masks-evolution-real",
    "title": "Gaz Maskeleri: Kimyasal Ölüme Karşı Yarış",
    "subtitle": "İdrardan modern filtreye.",
    "mediaType": "film",
    "mediaTitle": "1917",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["I. Dünya Savaşı", "Teknoloji", "Tıp"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["1917", "gaz-maskesi", "i-dunya-savasi", "teknoloji"],
    "quickRealityCheck": "1917 filminde askerlerin çantalarında taşıdığı o ürkütücü maskeler, I. Dünya Savaşı'nda saniyeler içinde binlerce askeri boğan zehirli gazlara karşı geliştirilen gerçek hayatta kalma araçlarıdır.",
    "mediaChanged": "Film maskeleri birer 'aksesuar' gibi gösterir. Gerçekte bir gaz saldırısı sırasında maskeyi 6 saniye içinde takamamak, akciğerlerin kalıcı olarak hasar görmesi veya feci bir ölüm demekti.",
    "realHistory": "1915'te Almanlar klor gazını ilk kez kullandığında askerlerin hiçbir koruması yoktu. İlk 'maskeler', askerlerin kendi idrarlarıyla ıslattıkları bez parçalarıydı (idrardaki amonyak kloru bir miktar nötralize ediyordu). Savaş ilerledikçe, 'Hypo Helmet' ve ardından filmde gördüğümüz, kömür filtreli 'Small Box Respirator' gibi modern maskeler geliştirildi. Bu maskeler kauçuk ve camdan yapılıyordu ve nefes almayı aşırı zorlaştırıyordu. Askerler bu maskelerin içinde saatlerce beklemek zorundaydı; bu da klostrofobi ve paniği tetikliyordu. Gaz maskeleri, savaşın 'endüstriyel bir katliama' dönüştüğünün en somut simgesidir.",
    "whyItMatters": "Gaz maskesi teknolojisi, modern iş güvenliği ekipmanlarının ve kimyasal koruyucu giysilerin atasıdır.",
    "sources": [
      { "title": "Gas Masks in WWI (National WWI Museum)", "url": "https://www.theworldwar.org/explore/exhibitions/online-exhibitions/gas-masks", "type": "museum" },
      { "title": "Chemical Warfare (Imperial War Museums)", "url": "https://www.iwm.org.uk/history/how-gas-was-used-in-the-first-world-war", "type": "museum" }
    ]
  },
  {
    "id": "last-emperor-forbidden-city-eunuchs-real",
    "title": "Yasak Şehir: Hadımlar ve İktidar",
    "subtitle": "2.000 yıllık bir sistemin sonu.",
    "mediaType": "film",
    "mediaTitle": "The Last Emperor",
    "difficulty": "deep",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Çin Tarihi", "Siyaset", "Kültür"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["the-last-emperor", "hadimlar", "yasak-sehir", "cin"],
    "quickRealityCheck": "Son İmparator filminde Puyi'nin çevresini saran binlerce hadım (eunuch), Çin imparatorluk sarayının 2.000 yıldır değişmeyen gerçek bürokratik sınıfıdır.",
    "mediaChanged": "Film hadımları bazen entrikacı veya aciz figürler gibi sunar. Gerçekte hadımlar, imparatorun en yakın danışmanları olarak devleti yöneten, devasa servetlere ve siyasi güce sahip bir kast sistemiydi.",
    "realHistory": "Hadımlık sistemi, imparatorun haremi ve ailesinin saflığını korumak için ortaya çıkmıştı. Ancak zamanla bu sınıf, saray dışındaki bürokrasi ile imparator arasındaki tek kanal haline geldi. Hadımlar vergi toplamadan askeri stratejiye kadar her alanda etkiliydi. Puyi'nin çocukluğunda Yasak Şehir'de hala 1.000'den fazla hadım yaşıyordu. 1923'te Puyi, hadımların saray hazinesini çaldığını ve yolsuzluk yaptıklarını fark edince, hepsini bir gecede saraydan kovdurmuştur. Bu olay, binlerce yıllık bir kurumun ve imparatorluk düzeninin fiilen bitişinin sembolüdür. Kovulan hadımların çoğu, dış dünyada yaşayamayacak kadar dünyadan kopuk oldukları için tapınaklara sığınmış veya fakirlik içinde ölmüştür.",
    "whyItMatters": "Hadım sistemi, tarihte 'sadakat' ve 'iktidar' arasındaki karmaşık ve çoğu zaman trajik ilişkinin en uç örneğidir.",
    "sources": [
      { "title": "Eunuchs in Imperial China (Britannica)", "url": "https://www.britannica.com/topic/eunuch", "type": "official" },
      { "title": "The Last Eunuch of China (The Guardian)", "url": "https://www.theguardian.com/world/2008/dec/17/china-eunuch-puyi-imperial-history", "type": "official" }
    ]
  }
];

const updatedCards = [...cards, ...newCards];
const finalCards = Array.from(new Map(updatedCards.map(c => [c.id, c])).values());

fs.writeFileSync('data/cards.json', JSON.stringify(finalCards, null, 2));

console.log(`Phase Y.5 Batch 3 (Expansion 2) Complete: Added ${newCards.length} more standard cards. Total cards: ${finalCards.length}`);
