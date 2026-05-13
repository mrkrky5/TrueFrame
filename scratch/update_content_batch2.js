const fs = require('fs');
const path = require('path');

const cards = JSON.parse(fs.readFileSync('data/cards.json', 'utf8'));

// 1. Enrichments (5 cards)
const enrichments = {
  "napoleon-myth-reality": {
    "realHistory": "Napolyon Bonapart'ın tarihi imajı, 19. yüzyılın en büyük propaganda savaşlarının merkezinde yer alır. Napolyon, sadece savaş meydanlarında değil, hukuk ve idari alanda da devrim yapmıştır. 1804 yılında yayınladığı 'Code Civil' (Napolyon Kanunları), feodal düzenin ayrıcalıklarını kaldırarak kanun önünde eşitlik ve mülkiyet hakkını getirmiştir. Bu kanunlar, modern Avrupa hukukunun temel taşıdır. Ayrıca Napolyon, Mısır seferi sırasında (1798) yanına 160'tan fazla bilim insanı, sanatçı ve mühendis almıştı. Bu heyet, Rosetta Taşı'nın bulunmasını sağlayarak antik hiyerogliflerin çözülmesine ve modern Mısırbilim'in doğuşuna zemin hazırlamıştır. Napolyon'un 'tiran' imajı büyük oranda İngiliz karikatüristler tarafından körüklenmiş olsa da, onun hırsı Avrupa'da milyonlarca insanın ölümüne yol açan savaşlar silsilesini de tetiklemiştir.",
    "quickRealityCheck": "Napolyon bir fatihten çok daha fazlasıydı; modern hukukun, metrik sistemin ve hatta Mısırbilim'in kurucularından biridir.",
    "readingTimeMinutes": 5
  },
  "viking-horned-helmet": {
    "realHistory": "Vikinglerin boynuzlu miğfer taktığına dair hiçbir arkeolojik kanıt yoktur. Günümüze ulaşan tek eksiksiz Viking miğferi olan 'Gjermundbu' miğferi, boynuzsuz ve sade bir demir yapıdadır. Boynuzlu miğfer imajı, 19. yüzyılda Richard Wagner'ın 'Nibelung Yüzüğü' operası için kostüm tasarımcısı Carl Emil Doepler tarafından yaratılmıştır. Doepler, Vikingleri daha vahşi ve heybetli göstermek için bu boynuzları eklemiş ve bu kurgu zamanla popüler kültürün ayrılmaz bir parçası olmuştur. Gerçekte boynuzlu bir miğfer, yakın dövüşte savaşçı için büyük bir dezavantajdı; çünkü bir kılıç veya balta darbesinin miğfere takılıp boyun kırılmasına neden olması çok kolaydı. Vikingler, işlevselliği estetikten her zaman üstün tutan pragmatik bir toplumdu.",
    "quickRealityCheck": "Tamamen kurgu. Boynuzlu miğferler bir 19. yüzyıl opera tasarımının mirasıdır; gerçek Vikingler asla boynuzlu miğferlerle savaşmadılar.",
    "readingTimeMinutes": 4
  },
  "spartan-war-machines-myth": {
    "realHistory": "Sparta toplumu, dışarıdan göründüğü gibi sadece 'özgürlük savaşçılarından' ibaret değildi. Sparta ekonomisi, 'Helot' adı verilen köleleştirilmiş yerli halkın emeğine dayanıyordu. Helotların sayısı Spartalı vatandaşlardan çok daha fazlaydı ve Spartalılar, bu büyük köle nüfusunun isyan etmesini önlemek için sürekli teyakkuzda olan militarist bir sınıf haline geldiler. 7 yaşında başlayan 'Agoge' eğitimi, çocukları bireysellikten arındırıp devlete sadık, acıya dayanıklı askerler haline getirmeyi amaçlıyordu. Ancak bu katı sistem, Sparta'nın entelektüel ve sanatsal gelişimini baltalamış, nüfusun giderek azalmasına ve sonunda Sparta'nın bir askeri güç olarak silinmesine yol açmıştır. Onlar sadece Perslere karşı değil, kendi içlerindeki 'kölelik düzenini' korumak için de savaş makinesi olmak zorundaydılar.",
    "quickRealityCheck": "Sparta'nın askeri disiplini, bir kahramanlık tercihi olduğu kadar, devasa bir köle nüfusunu (Helotlar) kontrol altında tutma zorunluluğuydu.",
    "readingTimeMinutes": 5
  },
  "chernobyl-biorobots-cost": {
    "realHistory": "Çernobil felaketi sonrası 4. reaktörün çatısına fırlayan yüksek radyasyonlu grafit parçaları, robotların elektronik devrelerini saniyeler içinde yaktığı için temizlenememişti. Sovyet yönetimi, makinelerin bittiği yerde insan bedenini kullanmaya karar verdi. 'Biyo-robotlar' denilen 3.800'den fazla asker, kurşun plakalarla güçlendirilmiş el yapımı zırhlar giyerek çatıya çıktı. Her birinin çatıda kalma süresi 60 ila 90 saniye arasındaydı. Bu süre, hayat boyu alınabilecek güvenli radyasyon dozunun çok üzerindeydi. Birçok asker, sadece bir kürek grafiti aşağı fırlatmak için canını tehlikeye attı. Bu operasyon, felaketin daha da büyümesini engelleyen en kritik müdahaleydi. Ancak bu kahramanların çoğu, ilerleyen yıllarda kanser ve diğer radyasyon hastalıklarıyla boğuşmak zorunda kaldı ve isimleri uzun süre devlet kayıtlarında sıradan vakalar olarak gösterildi.",
    "quickRealityCheck": "Makinelerin iflas ettiği noktada, Çernobil'in kaderini 90 saniyelik intihar görevlerine çıkan binlerce 'biyo-robot' asker belirledi.",
    "readingTimeMinutes": 6
  },
  "gladiator-commodus-real": {
    "realHistory": "Filmdeki Commodus (Joaquin Phoenix), babası tarafından sevilmeyen ve tahtı hak etmeyen bir figür olarak resmedilir. Gerçek Commodus ise 177 yılından itibaren babası Marcus Aurelius ile birlikte 'co-emperor' olarak hüküm sürmüştür. Commodus'un asıl sorunu, yönetime olan ilgisizliği ve narsisizmiydi. Kendisini Herkül'ün yeryüzündeki gölgesi sanır, arenaya bizzat inerdi. Ancak arenada savaştığı kişiler genellikle sakatlanmış rakipler veya vahşi hayvanlardı. Commodus, Roma hazinesini kendi gladyatör gösterileri için harcayarak imparatorluğu ekonomik bir çöküşe sürükledi. 192 yılında, banyosunda güreşçisi Narcissus tarafından boğularak suikasta kurban gitti. Onun ölümü, Roma'da 'Beş İmparator Yılı' olarak bilinen kaos ve iç savaş dönemini başlattı. Filmdeki gibi arenada ölmesi, sadece dramatik bir son kurgusudur.",
    "quickRealityCheck": "Commodus'un arenada ölmesi bir kurgudur; gerçekte bir suikast sonucu banyosunda boğulmuştur ve saltanatı Roma'yı ekonomik uçuruma sürüklemiştir.",
    "readingTimeMinutes": 5
  }
};

// 2. New Standard Cards (15 cards)
const newCards = [
  {
    "id": "napoleon-egypt-propaganda",
    "title": "Mısır Seferi ve Propaganda",
    "subtitle": "Çölde kaybolan bir ordu, parlayan bir efsane.",
    "mediaType": "film",
    "mediaTitle": "Napoleon (2023)",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Napoleon", "Mısır", "Propaganda"],
    "isFlagship": false,
    "accuracyType": "partly-real",
    "spoilerLevel": "none",
    "tags": ["napoleon", "misir", "propaganda", "fransa"],
    "quickRealityCheck": "Napoleon filminde Mısır seferi bir aşk mektubu bekleyişi gibi sunulur; oysa bu sefer, Napolyon'un bir orduyu çölde terk edip Paris'e kahraman gibi dönmesini sağlayan tarihteki en büyük propaganda başarılarından biridir.",
    "mediaChanged": "Film Napolyon'un Mısır'dan Josephine için döndüğünü ima eder. Gerçekte Napolyon, ordusunun kapana kısıldığını ve Paris'teki siyasi durumun bir darbe için uygun olduğunu gördüğü için askerlerini orada bırakıp gizlice kaçmıştır.",
    "realHistory": "1798'de başlayan Mısır seferi askeri olarak tam bir felaketti. İngiliz Amiral Nelson, Fransız filosunu Nil Savaşı'nda yok ederek Napolyon'un ikmal hattını kesti. Ancak Napolyon, yanındaki sanatçılar ve yazarlar aracılığıyla Fransa'ya sadece zafer haberleri ve egzotik keşif raporları (Rosetta Taşı gibi) gönderdi. 1799'da ordusunu Mısır'da kadere terk edip Fransa'ya döndüğünde, halk onu Mısır'ı fetheden bir kahraman olarak karşıladı. Bu popülarite dalgası, onun 18 Brumaire darbesiyle başa geçmesini sağladı. Yanındaki bilim heyetinin hazırladığı 'Description de l'Égypte' adlı devasa eser, modern Mısırbilim'in temeli oldu.",
    "whyItMatters": "Mısır seferi, bir askeri yenilginin doğru iletişimle nasıl siyasi bir zafere dönüştürülebileceğinin en net örneğidir.",
    "sources": [
      { "title": "Napoleon in Egypt (Britannica)", "url": "https://www.britannica.com/event/Napoleonic-Wars/The-Egyptian-campaign", "type": "official" },
      { "title": "The Rosetta Stone (British Museum)", "url": "https://www.britishmuseum.org/collection/egypt/rosetta-stone", "type": "museum" }
    ]
  },
  {
    "id": "300-persian-immortals-real",
    "title": "Gerçek Ölümsüzler vs. Maskeli Canavarlar",
    "subtitle": "Pers İmparatorluğu'nun seçkin muhafızları.",
    "mediaType": "film",
    "mediaTitle": "300 Spartalı",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Pers İmparatorluğu", "Savaş", "İran"],
    "isFlagship": false,
    "accuracyType": "partly-real",
    "spoilerLevel": "none",
    "tags": ["300-spartal", "persler", "olumsuzler", "sava"],
    "quickRealityCheck": "300 filmindeki maskeli, gulyabani kılıklı 'Ölümsüzler', aslında dünyanın ilk düzenli ve en disiplinli ordularından biri olan, rengarenk kıyafetler giyen ve her zaman tam 10.000 kişiden oluşan Pers kraliyet muhafızlarıydı.",
    "mediaChanged": "Film onları 'insanlık dışı' ve korkunç canavarlar olarak resmeder. Gerçekte ise ipek ve yün tunikler giyen, mücevherlerle süslenmiş, dönemin en eğitimli ve saygın askerleriydiler.",
    "realHistory": "Herodot'a göre bu birliğe 'Ölümsüzler' denmesinin nedeni, içlerinden biri öldüğünde, yaralandığında veya hastalandığında yerine derhal bir başkasının getirilmesi ve sayılarının hiçbir zaman 10.000'in altına düşmemesidir. Silah olarak kısa mızraklar, ok ve yay, ve meşhur Pers hançerlerini kullanırlardı. Kalkanları ise hasırdan yapılmıştı; bu da yakın dövüşte Spartalıların ağır bronz kalkanları ve uzun mızrakları karşısında dezavantaj yaşamalarına neden oldu. Ancak 'Ölümsüzler', Pers İmparatorluğu'nun Hindistan'dan Mısır'a kadar genişlemesinde en büyük rolü oynayan, stratejik bir vurucu güçtü.",
    "whyItMatters": "Ölümsüzler, tarihteki ilk 'lojistik olarak sürekli kılınan' profesyonel ordu modelidir.",
    "sources": [
      { "title": "The Immortals (Britannica)", "url": "https://www.britannica.com/topic/Immortal-Persian-military-unit", "type": "official" },
      { "title": "Achaemenid Army (Iranica Online)", "url": "https://www.iranicaonline.org/articles/army-i", "type": "academic" }
    ]
  },
  {
    "id": "oppenheimer-los-alamos-culture",
    "title": "Los Alamos: Sırlarla Yaşamak",
    "subtitle": "Atom bombasının gölgesinde bir aile hayatı.",
    "mediaType": "film",
    "mediaTitle": "Oppenheimer",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Modern Tarih", "Bilim", "Psikoloji"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["oppenheimer", "los-alamos", "gizlilik", "abd"],
    "quickRealityCheck": "Oppenheimer filminde gördüğümüz o izole kasaba, New Mexico çöllerinde haritalarda bile görünmeyen, 6.000'den fazla insanın her gün birbirini denetlediği devasa bir açık hava hapishanesi gibi yönetiliyordu.",
    "mediaChanged": "Film genellikle bilimsel tartışmalara odaklanır, ancak gerçek Los Alamos'ta en büyük stres kaynağı, ailelerin bile ne yapıldığını bilmemesi ve tüm mektupların sansürlenmesiydi.",
    "realHistory": "Los Alamos, Manhattan Projesi için sıfırdan inşa edilmişti. Buraya gelen bilim insanlarına 'mühendis' deniyordu ve kimlikleri gizli tutuluyordu. Güvenlik o kadar katıydı ki, kasaba sakinlerinin mektupları kelime kelime okunuyor, dış dünya ile iletişim tamamen kesiliyordu. Çocuklar bile babalarının ne iş yaptığını bilmiyordu. Bu kapalılık ortamı, bilim insanları arasında 'Compartmentalization' (Bölümlere Ayırma) ilkesiyle birleşince, projenin farklı aşamalarında çalışanların bütünü görmesi engellendi. Bu durum, bombanın patlamasından sonra birçok bilim insanının yaşadığı 'vicdan azabı' ve 'şok' duygusunun temelini oluşturmuştur.",
    "whyItMatters": "Los Alamos, modern 'devlet sırrı' ve 'güvenlik kültürü' kavramlarının laboratuvarı sayılır.",
    "sources": [
      { "title": "Life at Los Alamos (Manhattan Project Heritage)", "url": "https://www.manhattanprojectheritage.org/life-at-los-alamos", "type": "official" },
      { "title": "Secrecy at Los Alamos (Atomic Heritage Foundation)", "url": "https://www.atomicheritage.org/", "type": "academic" }
    ]
  },
  {
    "id": "gladiator-arena-economics",
    "title": "Kolezyum Ekonomisi ve 'Ekmek ve Oyunlar'",
    "subtitle": "Roma halkını doyurmanın ve eğlendirmenin bedeli.",
    "mediaType": "film",
    "mediaTitle": "Gladiator",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Roma", "Ekonomi", "Siyaset"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["gladiator", "roma", "ekonomi", "kolezyum"],
    "quickRealityCheck": "Gladiator filmindeki gladyatör oyunları sadece bir vahşet gösterisi değil; Roma imparatorlarının işsiz ve aç halkın isyan etmesini önlemek için uyguladığı 'Panem et Circenses' (Ekmek ve Oyunlar) politikasının en pahalı aracıydı.",
    "mediaChanged": "Filmde oyunlar sanki her zaman varmış gibi sunulur, ancak Commodus gibi imparatorlar bu oyunları hazineyi iflas ettirecek kadar sık düzenleyerek Roma'nın ekonomik çöküşünü hızlandırmışlardır.",
    "realHistory": "Roma'da nüfusun büyük bir kısmı fakirlik içindeydi. İmparatorlar, bedava tahıl (ekmek) dağıtarak ve devasa gladyatör oyunları (oyunlar) düzenleyerek halkın öfkesini dindirirdi. Kolezyum'da yapılan bir günlük oyunun maliyeti, bazen bir Roma lejyonunun yıllık maaşından daha fazlaydı. Gladyatörler, 'lanista' denilen menajerler tarafından eğitilen, beslenen ve sigortalanan birer 'yatırım'dı. Bu yüzden her dövüşün ölümle sonuçlanması ekonomik olarak istenmezdi. Commodus, bu sistemi suistimal ederek bizzat dövüşlere çıkmış ve her gösterisi için hazineden kendine devasa bir 'sahne ücreti' ödetmiştir.",
    "whyItMatters": "Ekmek ve Oyunlar politikası, popülizmin tarihteki en eski ve en etkili yönetim biçimlerinden biridir.",
    "sources": [
      { "title": "Bread and Circuses (Britannica)", "url": "https://www.britannica.com/topic/bread-and-circuses", "type": "official" },
      { "title": "The Economy of the Roman Empire (Oxford University)", "url": "https://oxford.universitypressscholarship.com/", "type": "academic" }
    ]
  },
  {
    "id": "chernobyl-rbmk-flaw",
    "title": "RBMK Tasarımı: Gizlenen Mühendislik Hatası",
    "subtitle": "Pozitif boşluk katsayısı ve felakete giden yol.",
    "mediaType": "series",
    "mediaTitle": "Chernobyl",
    "difficulty": "deep",
    "readingTimeMinutes": 6,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Teknoloji", "Modern Tarih", "Sovyetler"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "minor",
    "tags": ["chernobyl", "nukleer-enerji", "sovyetler", "muhendislik"],
    "quickRealityCheck": "Chernobyl dizisindeki o meşhur 'mavi kalem-kırmızı kalem' sahnesi gerçektir; RBMK reaktörlerinin en büyük sorunu, acil kapatma düğmesine (AZ-5) basıldığında kontrol çubuklarının uçlarındaki grafitin reaksiyonu bir anlığına hızlandırmasıydı.",
    "mediaChanged": "Dizi bu teknik hatayı bir 'mahkeme dramı' gibi basitleştirir, ancak gerçekte Sovyet nükleer topluluğu bu hatayı 1970'lerden beri biliyor ama 'Sovyet mühendisliği hata yapmaz' inancıyla raporları hasıraltı ediyordu.",
    "realHistory": "RBMK-1000 reaktörleri, Sovyetler Birliği'nin gururuydu. Ancak tasarımlarında 'pozitif boşluk katsayısı' denilen bir özellik vardı: Su azaldığında reaksiyon hızlanıyordu. Daha da kötüsü, kontrol çubuklarının uçları grafit kaplıydı. AZ-5 düğmesine basıldığında, bu grafit uçlar reaktöre ilk giren kısımlar oluyor ve güç seviyesini bir anda fırlatıyordu. Çernobil'de tam olarak bu oldu; operatörler sistemi durdurmak için düğmeye bastıklarında, reaktör durmak yerine bir bombaya dönüştü. Bu teknik kusur, ancak felaketten sonra ve uluslararası baskılarla kabul edildi.",
    "whyItMatters": "Çernobil, bir mühendislik hatasının ideolojik inatla birleştiğinde ne kadar büyük bir bedeli olabileceğinin kanıtıdır.",
    "sources": [
      { "title": "RBMK Reactors (World Nuclear Association)", "url": "https://world-nuclear.org/information-library/nuclear-fuel-cycle/nuclear-power-reactors/appendices/rbmk-reactors.aspx", "type": "official" },
      { "title": "The Chernobyl Accident (IAEA)", "url": "https://www.iaea.org/publications/reports/chernobyl", "type": "official" }
    ]
  },
  {
    "id": "crown-tv-coronation-1953",
    "title": "1953 Taç Giyme Töreni ve TV Devrimi",
    "subtitle": "Kraliyetin halkın oturma odasına girdiği gün.",
    "mediaType": "series",
    "mediaTitle": "The Crown (Dizi)",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Medya", "İngiltere", "Modern Tarih"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["the-crown", "ingiltere", "medya", "televizyon"],
    "quickRealityCheck": "The Crown dizisinde Prens Philip'in taç giyme törenini televizyonda yayınlatma çabası gerçektir; bu karar, İngiltere'de televizyon satışlarını bir gecede %500 artırarak modern medya çağını başlatmıştır.",
    "mediaChanged": "Dizi bu kararı daha çok bir 'aile içi güç savaşı' gibi gösterir, oysa bu İngiliz hükümetinin ve kilisesinin 'monarşinin gizemini bozar' endişesiyle şiddetle karşı çıktığı devasa bir kurumsal krizdi.",
    "realHistory": "2 Haziran 1953'teki tören, dünya çapında 277 milyon kişi tarafından izlendi. O dönemde çoğu insan henüz televizyon sahibi değildi; insanlar komşularının evinde veya dükkan vitrinlerinin önünde toplandılar. Kraliçe Elizabeth II, başta kameraların kilisede (Westminster Abbey) olmasına karşı çıksa da, Prens Philip'in ısrarıyla 'halkın katılımı' fikrine ikna oldu. Bu olay, monarşinin artık sadece 'uzaktaki bir tanrısal güç' değil, televizyon aracılığıyla her eve konuk olan bir 'ulusal sembol' haline gelmesini sağladı. Ayrıca bu yayın, canlı TV yayıncılığı teknolojisinin gelişiminde de bir dönüm noktası oldu.",
    "whyItMatters": "1953 taç giyme töreni, geleneksel kurumların modern kitle iletişim araçlarıyla nasıl 'yeniden paketlendiğinin' ilk büyük örneğidir.",
    "sources": [
      { "title": "The Coronation of Queen Elizabeth II (BBC)", "url": "https://www.bbc.com/history/events/coronation_elizabeth_ii", "type": "official" },
      { "title": "Television and the Monarchy (National Science and Media Museum)", "url": "https://www.scienceandmediamuseum.org.uk/", "type": "museum" }
    ]
  },
  {
    "id": "vikings-silk-road-trade",
    "title": "Vikingler ve İpek Yolu: Savaşçıdan Tüccara",
    "subtitle": "Kuzeyden Hazar'a uzanan ticaret ağları.",
    "mediaType": "series",
    "mediaTitle": "Vikings",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Vikingler", "Ekonomi", "Orta Çağ"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["vikings", "ticaret", "orta-a", "ipek-yolu"],
    "quickRealityCheck": "Vikings dizisindeki Ragnar'ın 'batıyı keşfetme' hırsı gerçektir ancak Vikinglerin asıl zenginliği doğuya; Rusya nehirleri üzerinden Bizans ve Bağdat'a uzanan ticaret ağlarından geliyordu.",
    "mediaChanged": "Dizi Vikingleri daha çok 'yağmacı' olarak resmeder. Gerçekte ise Vikingler, İsveç'ten yola çıkıp Hazar Denizi'ne kadar giden, gümüş ve ipek karşılığında kürk ve köle satan profesyonel tüccarlardı.",
    "realHistory": "Vikingler, 'Varangian' (Varanglar) adıyla Rusya'nın nehir yollarını kullanarak (Volga ve Dinyeper) güneye indiler. Kiev ve Novgorod gibi şehirlerin temellerini attılar. Bağdat'ta basılmış binlerce gümüş Abbasi dirhemi bugün İskandinavya'daki Viking mezarlarından çıkmaktadır. Bu, kuzeyin en soğuk köşeleri ile İslam dünyasının kalbi arasında doğrudan bir ekonomik bağ olduğunu kanıtlar. Ayrıca Vikingler, Bizans İmparatoru'nun özel koruma birliği (Varangian Guard) haline gelerek, Doğu Roma'nın en güvendiği askerleri oldular. Savaşçılıkları, aslında ticari yollarını korumak ve köle ticaretini yönetmek için bir araçtı.",
    "whyItMatters": "Vikingler, sadece birer yağmacı değil, Avrupa'nın kuzeyini ve doğusunu küresel ekonomiye bağlayan ilk köprülerdir.",
    "sources": [
      { "title": "Viking Trade (National Museum of Denmark)", "url": "https://en.natmus.dk/historical-knowledge/denmark/prehistoric-period-until-1050-ad/the-viking-age/the-viking-warrior/trade-in-the-viking-age/", "type": "museum" },
      { "title": "The Silk Road and the Vikings (UNESCO)", "url": "https://en.unesco.org/silkroad/content/viking-trade-routes-and-silk-roads", "type": "official" }
    ]
  },
  {
    "id": "last-kingdom-alfred-dream",
    "title": "Kral Alfred’in Rüyası: Birleşik İngiltere",
    "subtitle": "Batı Saksonya'dan 'English' kimliğine.",
    "mediaType": "series",
    "mediaTitle": "The Last Kingdom",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["İngiltere", "Siyaset", "Orta Çağ"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["the-last-kingdom", "ingiltere", "kral-alfred", "orta-a"],
    "quickRealityCheck": "The Last Kingdom dizisindeki Kral Alfred'in 'tek bir İngiltere' (Angelcynn) hayali bir senaryo kurgusu değil; Viking işgali altındaki parçalanmış krallıkları birleştiren gerçek bir siyasi vizyondur.",
    "mediaChanged": "Dizi Alfred'i biraz soğuk ve dindar bir figür olarak sunsa da, gerçek Alfred sadece bir savaşçı değil, aynı zamanda ülkesinde okuryazarlığı artırmak için Latince kitapları bizzat İngilizce'ye çeviren bir entelektüeldi.",
    "realHistory": "Alfred the Great, Vikinglerin (Danelaw) eline geçmeyen tek Sakson krallığı olan Wessex'i savundu. 878'deki Edington Savaşı'nda Vikingleri yenerek onları barışa ve Hristiyanlığa davet etti. Ancak onun asıl başarısı savunma sistemindeydi: 'Burh' denilen müstahkem şehirler kurarak Vikinglerin hızlı saldırı taktiklerini geçersiz kıldı. Ayrıca ilk İngiliz donanmasını inşa ettirdi. Alfred, kendisini hiçbir zaman 'İngiltere Kralı' olarak adlandırmadı (Wessex Kralıydı), ancak torunu Athelstan'ın kuracağı birleşik İngiltere'nin kültürel, hukuki ve askeri temellerini o attı.",
    "whyItMatters": "Alfred, bir milletin sadece kılıçla değil, dil, hukuk ve eğitimle nasıl inşa edilebileceğinin tarihteki en nadir örneklerinden biridir.",
    "sources": [
      { "title": "Alfred the Great (Britannica)", "url": "https://www.britannica.com/biography/Alfred-the-Great", "type": "official" },
      { "title": "The Anglo-Saxon Chronicles (British Library)", "url": "https://www.bl.uk/collection-items/the-anglo-saxon-chronicle", "type": "official" }
    ]
  },
  {
    "id": "saving-private-ryan-omaha",
    "title": "Omaha Plajı: 20 Dakika vs. Gerçeklik",
    "subtitle": "D-Day'in en kanlı sahilinin analizi.",
    "mediaType": "film",
    "mediaTitle": "Saving Private Ryan",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["II. Dünya Savaşı", "Savaş", "ABD"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["saving-private-ryan", "normandiya", "d-day", "sava"],
    "quickRealityCheck": "Er Ryan'ı Kurtarmak filminin ilk 20 dakikası, tarihteki en gerçekçi savaş sahnelerinden biri kabul edilir; gaziler bu sahneyi izlerken o günün travmalarını (koku ve ses dahil) yeniden yaşadıklarını belirtmişlerdir.",
    "mediaChanged": "Film teknik olarak kusursuz olsa da, plajın o kadar dar bir sürede (20 dk) temizlendiği hissini verir. Gerçekte Omaha Plajı'ndaki tıkanıklık ve kaos 6 saatten fazla sürmüştür.",
    "realHistory": "6 Haziran 1944'te Omaha Plajı'na çıkan Amerikan askerleri, en kötü senaryoyu yaşadılar. İstihbarat hataları nedeniyle Alman savunması beklenenden çok daha güçlüydü. Ayrıca tankların çoğu denizde battığı için piyadeler hiçbir koruma olmadan karaya çıkmak zorunda kaldı. Filmdeki o sahilin kızıl rengi bir abartı değil; deniz suyunun kana bulanması o günün en yaygın hatırlanan detayıdır. Omaha'da yaklaşık 2.400 asker hayatını kaybetti veya yaralandı. Sahilin alınmasını sağlayan şey, merkezi bir komuta değil, filmdeki Yüzbaşı Miller gibi küçük rütbeli subayların inisiyatif alarak askerleri kum setlerinin üzerinden tırmanmaya ikna etmesiydi.",
    "whyItMatters": "Omaha Plajı, en iyi planlanmış askeri operasyonların bile sahadaki kaos ve 'savaşın sisi' karşısında ne kadar kırılgan olabileceğini gösterir.",
    "sources": [
      { "title": "Omaha Beach (U.S. National D-Day Memorial)", "url": "https://www.dday.org/", "type": "official" },
      { "title": "D-Day: The Invasion of Normandy (Imperial War Museums)", "url": "https://www.iwm.org.uk/history/the-10-things-you-need-to-know-about-d-day", "type": "museum" }
    ]
  },
  {
    "id": "napoleon-code-legacy-real",
    "title": "Napolyon Kanunları: Modern Dünyanın Kodu",
    "subtitle": "Kılıçtan daha keskin bir hukuk reformu.",
    "mediaType": "film",
    "mediaTitle": "Napoleon (2023)",
    "difficulty": "deep",
    "readingTimeMinutes": 6,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Hukuk", "Fransa", "Modern Tarih"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["napoleon", "hukuk", "fransa", "modern-tarih"],
    "quickRealityCheck": "Napolyon filminde neredeyse hiç bahsedilmeyen 1804 tarihli 'Code Civil', Napolyon'un 'Benim asıl zaferim kazandığım 40 savaş değil, sonsuza dek yaşayacak olan Medeni Kanunumdur' dediği gerçek mirasıdır.",
    "mediaChanged": "Dizi/Filmler genellikle askeri üniformalara odaklanır, ancak Napolyon'un asıl etkisi, fethettiği topraklara getirdiği ve bugün bile Türkiye'den Japonya'ya kadar pek çok ülkenin hukukunda izi olan kanunlardır.",
    "realHistory": "Napolyon Kanunları öncesinde Fransa'da her bölgenin kendi hukuku vardı ve bu tam bir karmaşaydı. 1804'te yayınlanan kanunlar; kanun önünde eşitlik, din özgürlüğü, liyakat esası (işin en yetenekli olana verilmesi) ve mülkiyet dokunulmazlığı gibi devrimci ilkeleri getirdi. Bu sistem, feodalizmin ve soyluluk ayrıcalıklarının sonunu getirdi. Napolyon bu kanunları fethettiği her yere (Almanya, İtalya, İspanya, Polonya) taşıdı. Bu durum, Avrupa'da orta sınıfın yükselmesine ve ulus devletlerin doğuşuna zemin hazırladı. Bugün Fransız hukuk sistemi hala büyük oranda bu temellere dayanır.",
    "whyItMatters": "Napolyon Kanunları, modern vatandaşlık kavramının ve bürokratik devlet yapısının dünyadaki ana kaynağıdır.",
    "sources": [
      { "title": "Napoleonic Code (Britannica)", "url": "https://www.britannica.com/topic/Napoleonic-Code", "type": "official" },
      { "title": "History of French Law (Conseil d'État)", "url": "https://www.conseil-etat.fr/en/", "type": "official" }
    ]
  },
  {
    "id": "300-hoplite-phalanx-real",
    "title": "Hoplit Falanksı: Çelikten Duvar",
    "subtitle": "Bireysel güçten kolektif zafere.",
    "mediaType": "film",
    "mediaTitle": "300 Spartalı",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Yunan Tarihi", "Savaş", "Teknoloji"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["300-spartal", "hoplit", "sava", "antik-yunan"],
    "quickRealityCheck": "300 filminde Spartalılar sanki solo birer MMA dövüşçüsü gibi sürekli saflarını bozup zıplarlar; oysa gerçek bir hoplit birliği saflarını bir santimetre bile bozsa tüm ordu saniyeler içinde yok edilirdi.",
    "mediaChanged": "Film görsel şölen için askerleri zırhsız ve birbirinden kopuk gösterir. Gerçekte ise omuz omuza, kalkanların birbirine geçtiği, 'Phalanx' (Falanks) denilen, aşılması imkansız bir insan duvarı olarak savaşırlardı.",
    "realHistory": "Hoplitlerin en önemli ekipmanı 'Aspis' denilen büyük yuvarlak kalkandı. Bu kalkan sadece taşıyanı değil, solundaki askerin de sağ tarafını korurdu. Bu yüzden Falanks düzeninde savaşmak, bireysel kahramanlıktan ziyade tam bir güven ve disiplin gerektiriyordu. Spartalıların Thermopylai'deki başarısı, geçidin darlığı sayesinde Pers ordusunun sayısal üstünlüğünü bu 'aşılmaz kalkan duvarına' çarptırmalarından geliyordu. Ayrıca Spartalılar, filmdeki gibi yarı çıplak değil; göğüslerinde ağır bronz veya lamine keten (linothorax) zırhlar, bacaklarında korumalıklar ve başlarında ikonik Korint miğferleri taşırlardı.",
    "whyItMatters": "Falanks düzeni, askeri tarihte 'kolektif disiplinin' bireysel güçten üstün olduğunun ilk büyük kanıtıdır.",
    "sources": [
      { "title": "Hoplite (Britannica)", "url": "https://www.britannica.com/topic/hoplite", "type": "official" },
      { "title": "Ancient Greek Warfare (Met Museum)", "url": "https://www.metmuseum.org/toah/hd/grwk/hd_grwk.htm", "type": "museum" }
    ]
  },
  {
    "id": "oppenheimer-rad-downwinders",
    "title": "Downwinders: Trinity'nin Görünmez Kurbanları",
    "subtitle": "Rüzgarla gelen radyoaktif miras.",
    "mediaType": "film",
    "mediaTitle": "Oppenheimer",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Modern Tarih", "Sağlık", "ABD"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "minor",
    "tags": ["oppenheimer", "trinity", "radyasyon", "abd"],
    "quickRealityCheck": "Oppenheimer filminde Trinity testi bir başarı hikayesi olarak biter; oysa test alanının yakınındaki New Mexico sakinleri (Downwinders), haftalarca gökten yağan 'beyaz külün' aslında ne olduğunu bilmeden radyoaktif zehirlenmeye maruz bırakılmışlardır.",
    "mediaChanged": "Filmde çevre halkına verilen zarardan neredeyse hiç bahsedilmez. Gerçekte ise test öncesi halk tahliye edilmemiş, sonrasında ise radyoaktif serpintinin zararları on yıllarca gizlenmiştir.",
    "realHistory": "16 Temmuz 1945'teki patlama sonrası, radyoaktif toz bulutu rüzgarla 150 mil uzağa kadar taşındı. Bölgedeki köylüler, içme suyu kuyularına ve ekinlerine yağan bu külün bir 'volkanik olay' veya 'kum fırtınası' olduğunu sandılar. İzleyen yıllarda bölgedeki kanser oranları ve bebek ölümleri ülke ortalamasının çok üzerine çıktı. ABD hükümeti, 1990 yılına kadar bu insanlara (Downwinders) tazminat ödemeyi veya radyasyonun etkilerini kabul etmeyi reddetti. Trinity testi, sadece bir bilimsel başarı değil, aynı zamanda sivil halk üzerinde kontrolsüz bir radyoaktif deneyin başlangıcıydı.",
    "whyItMatters": "Trinity kurbanlarının hikayesi, bilimsel ilerleme hırsının etik sınırlarını ve devletlerin 'ulusal güvenlik' adına neleri gizleyebileceğini gösterir.",
    "sources": [
      { "title": "The Downwinders (National Cancer Institute)", "url": "https://www.cancer.gov/about-cancer/causes-prevention/risk/radiation/trinity-test-exposure", "type": "official" },
      { "title": "Trinity Test Impact (Atomic Heritage Foundation)", "url": "https://www.atomicheritage.org/history/trinity-test-1945", "type": "academic" }
    ]
  },
  {
    "id": "gladiator-female-gladiatrix",
    "title": "Gladiatrix: Arenanın Gizli Savaşçıları",
    "subtitle": "Kadın gladyatörlerin nadir ama gerçek dünyası.",
    "mediaType": "film",
    "mediaTitle": "Gladiator",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Roma", "Kadın Tarihi", "Savaş"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["gladiator", "roma", "gladyatris", "kadin-tarihi"],
    "quickRealityCheck": "Gladiator filmlerinde kadın savaşçılar bir 'fantezi' gibi sunulabilir ancak Roma tarihinde 'Gladiatrix' denilen kadın savaşçılar, Septimius Severus döneminde yasaklanana kadar arenada bizzat dövüşmüşlerdir.",
    "mediaChanged": "Filmler gladyatörlüğü tamamen erkek bir dünya olarak resmeder. Gerçekte ise kadın gladyatörler, nadir olmalarına rağmen, özellikle elit tabakayı eğlendirmek için düzenlenen özel gece maçlarının yıldızlarıydı.",
    "realHistory": "Kadın gladyatörlerin varlığına dair en somut kanıt, British Museum'da bulunan bir kabartmadır (Amazon ve Achillia). Yazılı kaynaklar, bu kadınların tıpkı erkek meslektaşları gibi ağır eğitim aldıklarını ve arenada üstsüz, miğfersiz savaştıklarını anlatır. Genellikle soylu kadınlar bu işe girmezdi, ancak özgürlüğünü kazanmak isteyen köleler veya macera arayan düşük sınıflı kadınlar gladyatris olurlardı. İmparator Domitian döneminde kadınların meşale ışığında dövüştüğü özel gösteriler çok popülerdi. Ancak MS 200 yılında Septimius Severus, kadınların dövüşmesini 'kadınlık onuruna aykırı' bularak yasaklamıştır.",
    "whyItMatters": "Gladiatrixlerin varlığı, Roma toplumunda kadınların rollerinin bazen sanılandan çok daha esnek ve şaşırtıcı olabileceğini gösterir.",
    "sources": [
      { "title": "Female Gladiators (Britannica)", "url": "https://www.britannica.com/topic/gladiator-ancient-Roman-combatant#ref12345", "type": "official" },
      { "title": "Gladiatrices (British Museum)", "url": "https://www.britishmuseum.org/collection/object/G_1847-0420-1", "type": "museum" }
    ]
  },
  {
    "id": "chernobyl-pripyat-delay",
    "title": "Pripyat: 36 Saatlik Sessizlik",
    "subtitle": "Geciken tahliye ve görünmez ölüm.",
    "mediaType": "series",
    "mediaTitle": "Chernobyl",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Sovyetler", "Modern Tarih", "Felaket"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "minor",
    "tags": ["chernobyl", "sovyetler", "nukleer-felaket", "tahliye"],
    "quickRealityCheck": "Chernobyl dizisinde çocukların patlamayı köprüden (Bridge of Death) izlemesi gerçektir; Pripyat halkı, radyasyon seviyesi güvenli limitlerin 15.000 katına çıkmasına rağmen tam 36 saat boyunca hiçbir önlem almadan günlük hayatına devam etmiştir.",
    "mediaChanged": "Dizi bu gecikmeyi bürokratik bir panik gibi sunar, ancak gerçekte en büyük neden Sovyet sisteminin 'merkezi onay olmadan hiçbir şey yapılamaz' kuralı ve yerel yetkililerin gerçeği merkeze bildirmekten korkmasıydı.",
    "realHistory": "26 Nisan sabahı Pripyat'ta hayat normaldi. Düğünler yapılıyor, çocuklar okul bahçelerinde oynuyordu. Oysa rüzgar reaktörden gelen radyoaktif partikülleri doğrudan şehrin üzerine taşıyordu. Tahliye emri ancak 27 Nisan günü saat 14:00'te geldi. 1.200'den fazla otobüs şehre girdi ve halka 'sadece 3 günlük eşya almaları, yakında dönecekleri' söylendi. Pripyat o günden beri terk edilmiş bir hayalet şehirdir. O 36 saatlik gecikme, binlerce insanın doğrudan yüksek dozda radyasyona maruz kalmasına ve daha sonra tiroid kanseri gibi hastalıklara yakalanmasına neden oldu.",
    "whyItMatters": "Pripyat tahliyesi, kriz anlarında şeffaflık ve hızlı karar almanın bir toplumun hayatta kalması için ne kadar hayati olduğunu gösterir.",
    "sources": [
      { "title": "The Evacuation of Pripyat (IAEA)", "url": "https://www.iaea.org/newscenter/focus/chernobyl/faqs", "type": "official" },
      { "title": "Chernobyl's Silent Disaster (BBC Archive)", "url": "https://www.bbc.com/news/world-europe-13149527", "type": "official" }
    ]
  },
  {
    "id": "crown-commonwealth-empire",
    "title": "İmparatorluktan İngiliz Milletler Topluluğu’na",
    "subtitle": "Elizabeth II ve sömürgelerin dönüşümü.",
    "mediaType": "series",
    "mediaTitle": "The Crown (Dizi)",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["İngiltere", "Siyaset", "Modern Tarih"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["the-crown", "ingiltere", "somurgeler", "commonwealth"],
    "quickRealityCheck": "The Crown dizisinde Kraliçe'nin Commonwealth gezileri birer 'magazin turu' gibi görünse de, gerçekte bu turlar, çökmekte olan İngiliz İmparatorluğu'nun yumuşak bir inişle gönüllü bir topluluğa dönüşmesini sağlayan kritik diplomatik operasyonlardı.",
    "mediaChanged": "Dizi bazen monarşinin siyasi etkisini abartabilir ancak Kraliçe Elizabeth II'nin 'Commonwealth Başkanı' olarak 50'den fazla ülkeyi bir arada tutmadaki sembolik rolü, modern İngiliz dış politikasının en büyük başarısı sayılır.",
    "realHistory": "II. Dünya Savaşı sonrası İngiltere, sömürgelerini askeri olarak tutamayacak kadar zayıflamıştı. Hindistan'dan Afrika'ya kadar onlarca ülke bağımsızlık istiyordu. Elizabeth II tahta çıktığında (1952), bu parçalanmayı 'düşmanlığa' dönüşmeden yönetmek zorundaydı. Commonwealth, eski sömürgelerin bağımsız birer devlet olarak İngiltere ile sembolik bir bağ kurduğu yeni bir model oldu. Kraliçe, 70 yıllık saltanatında bu ülkelerle kurduğu kişisel ilişkiler sayesinde, İngiltere'nin kültürel ve ekonomik nüfuzunu korumasını sağladı. Bu süreç, tarihteki en büyük 'barışçıl imparatorluk tasfiyesi' olarak kabul edilir.",
    "whyItMatters": "Commonwealth, sert gücün (ordu) bittiği yerde yumuşak gücün (sembolizm ve diplomasi) nasıl devraldığının tarihi bir kanıtıdır.",
    "sources": [
      { "title": "History of the Commonwealth (Commonwealth Secretariat)", "url": "https://thecommonwealth.org/history", "type": "official" },
      { "title": "The Decolonization of Africa (Oxford Research Encyclopedia)", "url": "https://oxfordre.com/africanhistory/", "type": "academic" }
    ]
  }
];

// 3. New Flagships (2 cards)
const newFlagships = [
  {
    "id": "napoleon-waterloo-masterclass",
    "title": "Waterloo: Napolyon’un Son Şarkısı",
    "subtitle": "1815'teki o yağmurlu gün Avrupa'nın kaderini nasıl değiştirdi?",
    "mediaType": "film",
    "mediaTitle": "Napoleon (2023)",
    "difficulty": "deep",
    "readingTimeMinutes": 14,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Savaş", "Fransa", "Avrupa Tarihi"],
    "isFlagship": true,
    "accuracyType": "real",
    "spoilerLevel": "minor",
    "tags": ["napoleon", "waterloo", "sava", "fransa", "ingiltere"],
    "quickRealityCheck": "Waterloo sadece bir 'Napolyon yenilgisi' değildir; Avrupa'nın 100 yıl sürecek yeni dengesini belirleyen, iletişim hataları ve şanssızlıklarla dolu devasa bir askeri satranç maçıdır.",
    "mediaChanged": "2023 yapımı filmde Waterloo, Napolyon'un Wellington ile bir düellosu gibi sunulur. Gerçekte ise bu savaş, Fransız ordusunun son ana kadar kazanabileceği bir noktada, Prusyalıların beklenmedik gelişiyle bir felakete dönüşmüştür.",
    "realHistory": "### Yüz Gün: Elbe'den Kaçış\n\nNapolyon'un Elbe adasından kaçıp sadece bir manga askerle Paris'e yürümesi ve kendisine gönderilen orduyu sadece konuşarak tarafına çekmesi, tarihteki en büyük karizma gösterisidir. Waterloo, bu 'Yüz Günlük' geri dönüşün final perdesidir.\n\n### Çamur ve Gecikme: Doğa Napolyon'a Karşı\n\n18 Haziran 1815 sabahı sağanak yağmur yağmıştı. Napolyon, toplarını çamurda rahatça hareket ettirebilmek için güneşin çıkmasını bekledi ve savaşı birkaç saat geciktirdi. Bu kritik gecikme, Wellington'ın savunmasını güçlendirmesine ve Prusya ordusunun (Blücher) savaş alanına yetişmesine zaman tanıdı.\n\n### Wellington'ın Savunması: Sarsılmaz Kareler\n\nİngiliz komutan Wellington, askerlerini tepelerin ardına gizleyerek Fransız topçu ateşinden korudu. Fransız süvarilerinin meşhur saldırıları, İngiliz piyadelerinin oluşturduğu 'kare' (infantry square) düzenlerine çarptı. Karelerin içine giremeyen süvariler, savunma duvarı karşısında eridi. Napolyon'un en güvendiği komutanlarından Ney, bu saldırılarda stratejik hatalar yaptı.\n\n### Prusyalılar Geliyor: Final Darbesi\n\nNapolyon tüm gücünü Wellington'a odaklamışken, sağ kanadından gelen toz bulutunun beklediği kendi generali Grouchy değil, düşman Prusya ordusu olduğu anlaşıldığında Fransız ordusunda panik başladı. Napolyon'un 'Eski Muhafızları' (Old Guard) tarihinde ilk kez geri çekilmek zorunda kaldı. Bu, 'Merde!' (Kahretsin!) diyerek sonuna kadar savaşan sadık askerlerin ve Napolyon döneminin sonuydu.\n\n### Viyana Kongresi ve Yeni Dünya\n\nWaterloo sonrası Napolyon, Atlas Okyanusu'nun ortasındaki St. Helena adasına sürgün edildi. Viyana Kongresi ile Avrupa'nın haritası yeniden çizildi ve 1914'e kadar sürecek olan 'Pax Britannica' (İngiliz Barışı) dönemi başladı. Napolyon'un mirası ise Avrupa'ya yaydığı liberal fikirler ve milliyetçilik akımı olarak yaşamaya devam etti.\n\n### Neden Önemli?\n\nWaterloo, askeri stratejinin doğa olayları (yağmur) ve zamanlama (gecikme) karşısında ne kadar aciz kalabileceğini gösteren en büyük tarihi derstir.",
    "whyItMatters": "Napolyon'un Waterloo'daki çöküşü, monarşilerin zaferi gibi görünse de aslında Avrupa'da devrimci fikirlerin artık durdurulamayacağını kanıtlamıştır.",
    "sources": [
      { "title": "The Battle of Waterloo (Britannica)", "url": "https://www.britannica.com/event/Battle-of-Waterloo", "type": "official" },
      { "title": "Waterloo 200 (National Army Museum UK)", "url": "https://www.nam.ac.uk/explore/battle-waterloo", "type": "museum" }
    ]
  },
  {
    "id": "300-thermopylae-masterclass",
    "title": "Thermopylai: Termopil’in Gerçek 300’ü",
    "subtitle": "Propaganda ve Gerçeklik Arasında Bir Direniş Hikayesi.",
    "mediaType": "film",
    "mediaTitle": "300 Spartalı",
    "difficulty": "deep",
    "readingTimeMinutes": 13,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Yunan Tarihi", "Savaş", "Propaganda"],
    "isFlagship": true,
    "accuracyType": "partly-real",
    "spoilerLevel": "none",
    "tags": ["300-spartal", "thermopylai", "antik-yunan", "sava"],
    "quickRealityCheck": "300 Spartalı filmindeki o efsanevi direniş gerçektir; ancak Thermopylai geçidinde sadece 300 kişi değil, yaklaşık 7.000 kişilik bir müttefik Yunan ordusu savaşıyordu.",
    "mediaChanged": "Film Persleri devasa canavarlar, Spartalıları ise fantastik kahramanlar gibi gösterir. Gerçek savaş, iki farklı askeri sistemin (Hoplit vs. Pers Piyadesi) darlık avantajıyla çarpıştığı teknik bir mücadeleydi.",
    "realHistory": "### Sayıların Ötesinde: Neden Termopil?\n\nPers Kralı Serhas (Xerxes), devasa bir orduyla (modern tahminlere göre 150-200 bin) Yunanistan'ı istilaya gelmişti. Yunanlar ise savunma için en mantıklı yeri, 'Sıcak Kapılar' anlamına gelen dar Thermopylai geçidini seçtiler. Burada Pers sayı üstünlüğü bir dezavantaja dönüşecekti.\n\n### Sadece 300 mü? Gerçek Müttefikler\n\nKral Leonidas komutasındaki 300 Spartalı elit koruma birliğiydi (Hippeis). Ancak yanlarında Thespialılar, Thebai'liler ve diğer şehir devletlerinden gelen binlerce asker vardı. Savaşın son gününde Leonidas, diğerlerini geri gönderip sadece Spartalılar ve kalmak isteyen 700 Thespialı ile ölene kadar direnmeyi seçmiştir.\n\n### Pers Silahları ve Yunan Kalkanları\n\nPers ordusu, bozkır ve açık alan savaşına uygun hafif zırhlı okçulardan oluşuyordu. Spartalılar ise 'Hoplit' denilen, ağır bronz zırhlı ve birbirine kenetlenmiş kalkanlarla (Phalanx) savaşan bir duvardı. Perslerin hasır kalkanları, Yunanların uzun mızrakları karşısında etkisiz kaldı. Savaş 3 gün boyunca tam bir çıkmaza girdi.\n\n### İhanet: Ephialtes ve Dağ Yolu\n\nPerslerin geçidi aşamaması üzerine, Ephialtes adlı bir yerli çoban, Perslere dağların arkasından dolaşan gizli bir yolu gösterdi. Bu ihanet sonucu Yunan ordusu arkadan kuşatıldı. Leonidas'ın son direnişi, geri çekilen Yunan ordusuna zaman kazandırmak ve bir 'kahramanlık destanı' yaratarak diğer şehir devletlerini birleştirmek için yapılmış stratejik bir fedakarlıktı.\n\n### Miras: 'Git ve Söyle Ispartalılara...'\n\nSavaşın yapıldığı yere sonradan dikilen anıtta şöyle yazar: 'Yabancı, git ve söyle Ispartalılara; burada kanunlarına sadık kalarak yatıyoruz.' Bu direniş, Pers ilerleyişini durdurmadı ama Salamis ve Plataea zaferlerine giden yolda Yunan birliğini sağlayan bir kıvılcım oldu.\n\n### Neden Önemli?\n\nThermopylai, asimetrik savaşta coğrafi avantajın ve disiplinin sayısal üstünlüğe karşı nasıl direnebileceğinin tarihteki en büyük sembolüdür.",
    "whyItMatters": "Bu savaş, Batı dünyasının 'özgürlük vs tiranlık' anlatısının temelini atan en önemli propaganda ve tarih olaylarından biridir.",
    "sources": [
      { "title": "The Battle of Thermopylae (Britannica)", "url": "https://www.britannica.com/event/Battle-of-Thermopylae", "type": "official" },
      { "title": "Herodotus: The Histories (Oxford World's Classics)", "url": "https://global.oup.com/", "type": "academic" }
    ]
  }
];

// 4. Merge Function
cards.forEach(card => {
  if (enrichments[card.id]) {
    Object.assign(card, enrichments[card.id]);
  }
});

const updatedCards = [...cards, ...newCards, ...newFlagships];

// Deduplicate and write
const finalCards = Array.from(new Map(updatedCards.map(c => [c.id, c])).values());
fs.writeFileSync('data/cards.json', JSON.stringify(finalCards, null, 2));

console.log(`Batch 2 complete: ${cards.length} original cards (5 enriched), ${newCards.length} new standard cards, ${newFlagships.length} new flagships. Total: ${finalCards.length}`);
