const fs = require('fs');
const path = require('path');

const cards = JSON.parse(fs.readFileSync('data/cards.json', 'utf8'));

const newCards = [
  {
    "id": "1917-trench-comms-real",
    "title": "Siperlerde İletişim: Koşucular ve Gecikmeler",
    "subtitle": "Telefon hatlarının koptuğu yerde insan hızı.",
    "mediaType": "film",
    "mediaTitle": "1917",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["I. Dünya Savaşı", "Teknoloji", "İletişim"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["1917", "siper-savasi", "iletisim", "i-dunya-savasi"],
    "quickRealityCheck": "1917 filmindeki 'koşucu' mesaj iletimi bir kurgu değil; I. Dünya Savaşı'nda telefon hatlarının sürekli bombardıman altında kopması nedeniyle mesajların ulaştırılması tamamen bu genç askerlerin hızına ve şansına bağlıydı.",
    "mediaChanged": "Film kesintisiz bir takip hissi verse de, gerçekte bir mesajın ulaştırılması saatler sürebilir ve ulaştığında durum çoktan değişmiş olabilirdi.",
    "realHistory": "I. Dünya Savaşı'nın başında ordular sahra telefonlarını kullanmaya başladı. Ancak teller toprağın hemen altından geçtiği için top mermileri hatları saniyeler içinde parçalıyordu. Radyo teknolojisi ise henüz çok hantal ve güvenilmezdi. Bu yüzden ordular 'Runner' (Koşucu) denilen askerleri kullandı. Koşucular, açık arazide, bombardıman altında ve çamur içinde kilometrelerce koşmak zorundaydı. Mesajın ulaşıp ulaşmadığı genellikle bilinmezdi; bu yüzden aynı mesaj 3 veya 4 farklı koşucuyla gönderilirdi. İletişimdeki bu ilkel durum, generallerin cephedeki durumdan habersiz kalmasına ve binlerce askerin boş yere ölmesine neden olan en büyük etkendi.",
    "whyItMatters": "Savaş alanındaki iletişim teknolojisinin eksikliği, modern tarihin en büyük askeri trajedilerinin ana nedenidir.",
    "sources": [
      { "title": "Communications in WWI (National WWI Museum)", "url": "https://www.theworldwar.org/explore/exhibitions/online-exhibitions/communications", "type": "museum" },
      { "title": "Signallers and Runners (BBC)", "url": "https://www.bbc.co.uk/history/british/britain_wwone/war_comms_01.shtml", "type": "official" }
    ]
  },
  {
    "id": "valiant-hearts-war-dogs-real",
    "title": "Merhamet Köpekleri: Sanitätshunde",
    "subtitle": "No-man's land'in sessiz kahramanları.",
    "mediaType": "game",
    "mediaTitle": "Valiant Hearts",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["I. Dünya Savaşı", "Hayvanlar", "Tıp"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["valiant-hearts", "i-dunya-savasi", "kopekler", "tip"],
    "quickRealityCheck": "Valiant Hearts oyununda bize eşlik eden köpek, I. Dünya Savaşı'nda kullanılan ve 'Merhamet Köpeği' (Mercy Dogs) olarak bilinen gerçek arama-kurtarma köpeklerine bir saygı duruşudur.",
    "mediaChanged": "Oyun köpeği bir bulmaca ortağı gibi gösterir. Gerçekte bu köpeklerin görevi, bombardıman sonrası hayatta kalan yaralıları kokularından bulmak ve yanlarında tıbbi malzeme taşımaktı.",
    "realHistory": "I. Dünya Savaşı'nda özellikle Alman (Sanitätshunde) ve İngiliz orduları binlerce eğitimli köpek kullandı. Bu köpekler, insanların giremeyeceği kadar tehlikeli veya dar alanlardaki yaralı askerleri tespit etmek üzere eğitilmişti. Bir köpek yaralıyı bulduğunda, askerin şapkasını veya bir parça kıyafetini ağzına alıp bakıcısına götürürdü. Eğer asker ölmek üzereyse, köpek onun yanında bekleyerek son anlarında ona refakat ederdi. Savaşın sonunda bu köpeklerin binlerce askerin hayatını kurtardığı belgelenmiştir. Sadece arama kurtarma değil, haberleşme ve mühimmat taşıma işlerinde de kullanılmışlardır.",
    "whyItMatters": "Savaşın en karanlık anlarında bile insani yardımın (ve hayvanların) rolü, modern savaş hukukunun temel taşlarından biridir.",
    "sources": [
      { "title": "Mercy Dogs of WWI (National Museum of American History)", "url": "https://americanhistory.si.edu/", "type": "museum" },
      { "title": "War Dogs in the Trenches (Imperial War Museums)", "url": "https://www.iwm.org.uk/history/15-animals-that-went-to-war", "type": "museum" }
    ]
  },
  {
    "id": "pentiment-printing-press-clash",
    "title": "Matbaa vs. El Yazması: Bir Çağın Kırılışı",
    "subtitle": "Bilginin demokratikleşmesi ve rahiplerin korkusu.",
    "mediaType": "game",
    "mediaTitle": "Pentiment",
    "difficulty": "deep",
    "readingTimeMinutes": 6,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Rönesans", "Teknoloji", "Din"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "minor",
    "tags": ["pentiment", "matbaa", "orta-a", "ronesans"],
    "quickRealityCheck": "Pentiment oyunundaki Kiersau Manastırı'ndaki scriptorium'un kapanması, 16. yüzyıl Avrupa'sında bilginin rahiplerin tekelinden çıkıp matbaa makinelerine geçişinin gerçek bir temsilidir.",
    "mediaChanged": "Oyun bu süreci sanatsal bir hüzünle anlatır. Gerçekte bu geçiş, kilisenin bilgi üzerindeki kontrolünü kaybetmesine ve Reform hareketinin (Luther) tüm Avrupa'yı sarsmasına neden olan siyasi bir patlamadır.",
    "realHistory": "1450'lerde Gutenberg'in hareketli harf sistemini icat etmesiyle, bir kitabın üretim maliyeti saniyeler içinde %90 oranında düştü. O zamana kadar bir İncil'i el yazısıyla kopyalamak bir rahibin aylarını, bazen yıllarını alıyordu. Matbaa sayesinde bilgi artık sadece Latince bilen elitlerin değil, yerel dillerde okuyan halkın eline geçti. Manastırlar, yüzyıllardır sürdürdükleri 'kitap üreticisi' rolünü kaybettiler. Bu durum, sadece bir ekonomik kayıp değil, aynı zamanda dini otoritenin de sarsılması demekti. Pentiment'teki Andreas karakterinin bir sanatçı olarak bu iki dünya arasındaki sıkışmışlığı, dönemin entelektüel krizini mükemmel özetler.",
    "whyItMatters": "Matbaa devrimi, tarihte 'medya'nın siyasi ve dini sistemleri nasıl kökten değiştirebileceğinin ilk büyük örneğidir.",
    "sources": [
      { "title": "The Invention of Printing (Britannica)", "url": "https://www.britannica.com/topic/printing-publishing/History-of-printing", "type": "official" },
      { "title": "Transition from Manuscript to Print (Cambridge University)", "url": "https://www.cambridge.org/core/books/manuscript-to-print/", "type": "academic" }
    ]
  },
  {
    "id": "the-terror-franklin-canning",
    "title": "Franklin Seferi ve Konserve Felaketi",
    "subtitle": "Modern teknolojinin en büyük lojistik hatası.",
    "mediaType": "series",
    "mediaTitle": "The Terror",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Viktorya Dönemi", "Lojistik", "Kutup Keşifleri"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "minor",
    "tags": ["the-terror", "franklin-seferi", "kutup-kesfi", "teknoloji"],
    "quickRealityCheck": "The Terror dizisindeki bozuk konserve kutuları ve kurşun zehirlenmesi bir kurgu değil; 1845'teki gerçek Franklin seferinin trajik sonunu belirleyen en büyük teknik kusurdur.",
    "mediaChanged": "Dizi doğaüstü unsurlar (Tuunbaq) eklese de, arkeolojik bulgular ekibin asıl düşmanının kötü mühürlenmiş konserveler ve bunların içindeki kurşun olduğunu kanıtlamıştır.",
    "realHistory": "Franklin seferi, döneminin en ileri teknolojisiyle donatılmıştı: Buharlı makineler, kütüphaneler ve 3 yıllık yiyecek stoğu sağlayan 'yeni icat' konserve kutuları. Ancak konserveleri yapan Stephen Goldner, ihaleyi kazanmak için çok düşük fiyat vermiş ve üretim sürecini hızlandırmak için kutuları kurşunla lehimlemişti. Gemiler buzlar arasında sıkıştığında, ekip 3 yıl boyunca bu zehirli konservelerle beslendi. Kurşun zehirlenmesi; halsizlik, sanrılar ve karar verme yetisinin kaybına yol açtı. Beechey Adası'nda bulunan mürettebat kalıntılarında yapılan analizler, kurşun seviyesinin normalin 10 katı olduğunu doğrulamıştır. Bu 'modern' teknoloji, ekibi kurtarmak yerine yavaşça öldürmüştür.",
    "whyItMatters": "Franklin seferi, aşırı özgüvenin ve denetlenmeyen teknolojinin doğa karşısındaki acizliğini gösteren tarihi bir uyarıdır.",
    "sources": [
      { "title": "The Franklin Expedition (Britannica)", "url": "https://www.britannica.com/topic/Franklin-expedition", "type": "official" },
      { "title": "Lead Poisoning in the Franklin Crew (Royal Museums Greenwich)", "url": "https://www.rmg.co.uk/stories/topics/what-happened-franklin-expedition", "type": "museum" }
    ]
  },
  {
    "id": "last-emperor-manchukuo-propaganda",
    "title": "Mançukuo: Bir Propaganda Devleti",
    "subtitle": "Puyi'nin kukla imparatorluğu ve Japon hayali.",
    "mediaType": "film",
    "mediaTitle": "The Last Emperor",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Modern Tarih", "Çin", "Propaganda"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "minor",
    "tags": ["the-last-emperor", "mancukuo", "japonya", "cin"],
    "quickRealityCheck": "Son İmparator filminde Puyi'nin Mançukuo'ya gidişi bir kurtuluş gibi görünse de, gerçekte Japonya'nın Çin'i işgalini meşrulaştırmak için kurduğu devasa bir kukla devletin vitriniydi.",
    "mediaChanged": "Film Puyi'nin kişisel dramına odaklanır. Gerçekte Mançukuo, Japon ordusunun (Kwantung Ordusu) kontrolünde olan, Çinli nüfusa karşı ağır deneylerin (Birim 731) yapıldığı karanlık bir işgal bölgesidir.",
    "realHistory": "1932'de Japonya, Mançurya'yı işgal edince Puyi'yi 'Mançukuo İmparatoru' olarak tahta çıkardı. Amacı, yerel halka 'eski imparatorunuz geri döndü' mesajı vererek direnişi kırmaktı. Mançukuo kağıt üzerinde bağımsızdı ancak her bakanın arkasında 'danışman' adı verilen bir Japon yetkili vardı ve asıl kararları onlar alıyordu. Puyi, kendi sarayında bile hapis hayatı yaşıyor, dışarıya sadece Japonların izin verdiği fotoğraflar sızıyordu. Bu dönemde Japonya, bölgenin kaynaklarını sömürürken, Puyi sadece bir 'meşruiyet sembolü' olarak kullanıldı. 1945'te Japonya teslim olduğunda, Mançukuo da bir gecede çöktü.",
    "whyItMatters": "Mançukuo, modern tarihte 'vekalet devletleri' ve kukla yönetimlerin nasıl inşa edildiğinin en kapsamlı örneğidir.",
    "sources": [
      { "title": "Manchukuo (Britannica)", "url": "https://www.britannica.com/place/Manchukuo", "type": "official" },
      { "title": "Puyi and Manchukuo (National Museum of China)", "url": "https://www.chnmuseum.cn/en/", "type": "museum" }
    ]
  },
  {
    "id": "1917-no-mans-land-reality",
    "title": "No Man's Land: Gerçek Bir Kabus",
    "subtitle": "İki cephe arasındaki ölümcül boşluk.",
    "mediaType": "film",
    "mediaTitle": "1917",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["I. Dünya Savaşı", "Askeri Tarih"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["1917", "siper-savasi", "no-mans-land", "i-dunya-savasi"],
    "quickRealityCheck": "1917 filmindeki o çamurlu, ölülerle dolu ve tel örgülerle kaplı arazi, I. Dünya Savaşı'nın en korkunç gerçeği olan 'No Man's Land'in (Kimsesiz Toprak) oldukça isabetli bir tasviridir.",
    "mediaChanged": "Film görsel bir sanat yönetimiyle bu alanı sunar. Gerçekte bu alan sadece ölülerle değil, patlamamış mermiler, zehirli gaz kalıntıları ve diz boyu çamurla dolu, geçilmesi imkansız bir bataklıktı.",
    "realHistory": "İki düşman siperi arasındaki mesafe bazen 500 metre, bazen de sadece 10 metre olabiliyordu. No Man's Land, sürekli bombardıman nedeniyle bitki örtüsünün tamamen yok olduğu ve kraterlerle dolu bir Ay yüzeyine benziyordu. Yağmur yağdığında bu kraterler suyla doluyor, yaralı askerler bu çukurlara düşüp boğulabiliyordu. Gece olduğunda askerler buraya sızıp tel örgüleri tamir etmeye veya keşif yapmaya çalışırdı. Bir taarruz emri geldiğinde, binlerce asker bu açık alana çıkar ve makineli tüfek ateşi altında saniyeler içinde yok olurdu. Burası, savaşın 'anlamsızlığının' ve 'statikliğinin' fiziksel bir kanıtıydı.",
    "whyItMatters": "No Man's Land, modern savaşın yıkıcı gücünün doğayı nasıl tamamen yok edebileceğinin ilk büyük örneğidir.",
    "sources": [
      { "title": "No Man's Land (National WWI Museum)", "url": "https://www.theworldwar.org/explore/exhibitions/online-exhibitions/no-mans-land", "type": "museum" },
      { "title": "Life in the Trenches (Imperial War Museums)", "url": "https://www.iwm.org.uk/history/what-was-life-like-in-the-trenches-of-the-first-world-war", "type": "museum" }
    ]
  },
  {
    "id": "1917-siper-savasi-flagship",
    "title": "Siper Savaşı: Batı Cephesi’nin Statik Cehennemi",
    "subtitle": "Modern savaşın ritmi ve bir neslin yok oluşu.",
    "mediaType": "film",
    "mediaTitle": "1917",
    "difficulty": "deep",
    "readingTimeMinutes": 14,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["I. Dünya Savaşı", "Askeri Tarih", "Avrupa Tarihi"],
    "isFlagship": true,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["1917", "siper-savasi", "i-dunya-savasi", "bati-cephesi"],
    "quickRealityCheck": "1917 filmi bize bir yolculuk sunar; ancak gerçek siper savaşı, aylarca süren hareketsizlik, hastalık ve saniyeler içinde binlerce can alan anlamsız taarruzlardan ibaretti.",
    "mediaChanged": "Film karakterlerin sürekli hareket etmesine dayalı bir kurgu sunar. Gerçekte ise askerler günlerce aynı çamurlu çukurun içinde, hiç kıpırdamadan düşman mermisi bekleyerek yaşarlardı.",
    "realHistory": "### Siperlerin Anatomisi: Bir Yeraltı Dünyası\n\nSiperler sadece basit çukurlar değildi. Ön hat, destek hattı ve yedek hatlardan oluşan, kilometrelerce uzunlukta karmaşık bir labirentti. İsviçre sınırından Kuzey Denizi'ne kadar uzanan bu sistem, savaşın mobil değil 'statik' bir hal almasına neden oldu. Askerler burada 'Siper Ayağı' (Trench Foot) denilen çürümelere ve devasa fare istilalarına karşı hayatta kalmaya çalışırdı.\n\n### Ateşkes Değil, Yıkım: Topçu Ateşi\n\nI. Dünya Savaşı'ndaki ölümlerin %70'inden fazlası topçu ateşinden kaynaklanmıştır. 'Drumfire' denilen kesintisiz bombardımanlar günlerce sürer, askerlerin psikolojisini bozarak 'Shell Shock' (Savaş Travması) denilen durumu yaratırdı. 1917 filmindeki patlamalar, bu devasa yıkımın sadece küçük bir parçasıdır.\n\n### Makineli Tüfek: Savunmanın Gücü\n\nMakineli tüfeklerin savunmaya verdiği devasa avantaj, saldırı yapmayı intiharla eşdeğer kılıyordu. Binlerce asker 'üstten' (over the top) çıkıp düşman hattına koştuğunda, tek bir makineli tüfek yuvası tüm taburu dakikalar içinde yok edebilirdi. Bu durum, generalleri yeni bir çözüm aramaya itti: Tanklar.\n\n### Gaz Savaşı: Görünmez Ölüm\n\nSiperlerin en korkunç kabusu zehirli gazlardı. Klor ve hardal gazı gibi kimyasallar, rüzgarla birlikte siperlerin içine sızardı. Maske takmak için saniyeleri olan askerler için en ufak bir hata körlük veya akciğerlerin yanması demekti. 1917'de gaz maskeleri artık standart bir ekipmandı ama yarattığı dehşet hala taze kalmıştı.\n\n### Kayıp Nesil ve Savaşın Mirası\n\nSavaş 1918'de bittiğinde, Avrupa bir neslini kaybetmişti. Siperlerdeki bu statik dehşet, insanlığın teknolojiye ve ilerlemeye olan inancını sarsmış, modern sanat ve edebiyatta derin izler bırakmıştır. Bugün o siperlerin izleri hala Fransa ve Belçika topraklarında 'Kızıl Bölge' (Zone Rouge) olarak görülmektedir.\n\n### Neden Önemli?\n\nSiper savaşı, tarihte teknolojinin savunmayı saldırıdan ne kadar üstün kılabileceğinin ve askeri dehanın yeni silahlar karşısında ne kadar çaresiz kalabileceğinin en somut örneğidir.",
    "whyItMatters": "Siper savaşı deneyimi, modern savaş hukukunun ve kimyasal silah yasaklarının temel motivasyon kaynağıdır.",
    "sources": [
      { "title": "Trench Warfare (Britannica)", "url": "https://www.britannica.com/topic/trench-warfare", "type": "official" },
      { "title": "Western Front Life (National WWI Museum)", "url": "https://www.theworldwar.org/", "type": "museum" }
    ]
  },
  {
    "id": "the-terror-arctic-tragedy-flagship",
    "title": "Franklin Seferi: Buzun İçindeki Kayıp İmparatorluk",
    "subtitle": "Kibir, Konserve ve Kuzeybatı Geçidi.",
    "mediaType": "series",
    "mediaTitle": "The Terror",
    "difficulty": "deep",
    "readingTimeMinutes": 13,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["Viktorya Dönemi", "Lojistik", "Kutup Keşifleri"],
    "isFlagship": true,
    "accuracyType": "real",
    "spoilerLevel": "minor",
    "tags": ["the-terror", "franklin-seferi", "kutup-kesfi", "ingiltere"],
    "quickRealityCheck": "The Terror dizisindeki Franklin seferi, Viktorya dönemi İngiltere'sinin en büyük denizcilik trajedisidir; 129 kişilik mürettebattan tek bir kişi bile sağ kurtulamamıştır.",
    "mediaChanged": "Dizi mistik bir canavar kurgusu eklese de, gerçek trajedi tamamen insan hataları, teknik kusurlar ve kutup şartlarının acımasızlığına dayanmaktadır.",
    "realHistory": "### Hedef: Kuzeybatı Geçidi\n\n1845'te Sir John Franklin komutasındaki HMS Erebus ve HMS Terror, Avrupa ile Asya'yı birbirine bağlayan kısa yolu (Kuzeybatı Geçidi) bulmak için yola çıktı. Gemiler dönemin en gelişmiş zırhlarına ve buharlı motorlarına sahipti. Ancak İngilizler, Arktik kışının şiddetini hafife almışlardı.\n\n### Buzun İçinde Kilitli: 1846-1848\n\nGemiler King William Adası yakınlarında buzlara sıkıştı. Beklenen yaz erimesi gerçekleşmeyince, ekip iki kış boyunca gemilerde mahsur kaldı. Bu süreçte Sir John Franklin öldü ve komuta Francis Crozier'e geçti. Erzak tükenmeye, hastalıklar (iskorbüt ve kurşun zehirlenmesi) artmaya başladı.\n\n### Ölüm Yürüyüşü: Karaya Çıkış\n\n1848 Nisan ayında, hayatta kalan 105 kişi gemileri terk edip güneye, en yakın yerleşim yerine yürümeye karar verdi. Ancak bu binlerce kilometrelik, dondurucu ve yiyeceksiz bir yolculuktu. Askerler arkalarında devasa tekneleri çekerek (içinde gümüş kaşıklar ve ağır eşyalarla!) yürümeye çalıştılar; bu, Viktorya dönemi kibrinin en acı görüntüsüydü.\n\n### Inuitlerin Tanıklığı ve Yamyamlık\n\nBölgedeki Inuit halkı, 'beyaz adamların' açlıktan birbirlerini yediklerine dair raporlar verdiler. Viktorya dönemi İngiltere'si bu iddiaları 'barbarca uydurmalar' diyerek reddetti. Ancak 1980'lerde ve 90'larda yapılan kemik analizleri, mürettebat arasında sistemik yamyamlığın yaşandığını bilimsel olarak kanıtladı.\n\n### Batıkların Bulunuşu: 2014 ve 2016\n\nYüzyılı aşkın bir süre sonra, HMS Erebus ve HMS Terror'ün batıkları neredeyse sapasağlam halde bulundu. İlginç olan, gemilerin Inuit sözlü tarihinin işaret ettiği tam noktada bulunmuş olmasıdır. Bu durum, yerel bilginin modern teknolojik aramalardan daha isabetli olabileceğini kanıtlamıştır.\n\n### Neden Önemli?\n\nFranklin seferi, bir imparatorluğun teknolojik üstünlüğüne duyduğu aşırı güvenin, yerel bilgiye (Inuitler) duyulan küçümsemenin ve kötü planlanmış lojistiğin nasıl bir felaketle sonuçlanabileceğinin en net örneğidir.",
    "whyItMatters": "Bu trajedi, kutup araştırmaları tarihindeki en büyük gizemlerden biridir ve yerel bilginin bilimsel keşiflerdeki değerini hatırlatır.",
    "sources": [
      { "title": "The Franklin Expedition (The Canadian Encyclopedia)", "url": "https://www.thecanadianencyclopedia.ca/en/article/franklin-search", "type": "official" },
      { "title": "The Search for Erebus and Terror (Parks Canada)", "url": "https://www.pc.gc.ca/en/lhn-nhs/nu/epavefranklin-franklinwreck", "type": "official" }
    ]
  },
  {
    "id": "band-of-brothers-hedgerows-real",
    "title": "Hedgerow Savaşı: Normandiya’nın Bitmez Labirenti",
    "subtitle": "Bocage arazisinde ölüm kalım savaşı.",
    "mediaType": "series",
    "mediaTitle": "Band of Brothers",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["II. Dünya Savaşı", "Taktik", "Fransa"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["band-of-brothers", "normandiya", "bocage", "sava"],
    "quickRealityCheck": "Band of Brothers dizisindeki o sık ağaçlıklı, dar yollar (Bocage), Normandiya çıkarması sonrası müttefiklerin karşılaştığı en büyük taktiksel kabustur; tanklar bile bu doğal engelleri aşmakta zorlanmıştır.",
    "mediaChanged": "Dizi bu çatışmaları hızlı aksiyon sekansları olarak sunar. Gerçekte 'Hedgerow' (çit) savaşı, her bir tarlanın tek tek, ağır kayıplarla haftalarca süren temizlenmesi demekti.",
    "realHistory": "Normandiya'nın 'Bocage' arazisi, yüzyıllardır tarlaları birbirinden ayırmak için dikilen sık çalılıklar ve bunların altında oluşan sert toprak setlerden oluşur. Bu setler o kadar kalındır ki, bir tank bile üzerinden geçemez, altına girip havaya kalkar ve zayıf alt zırhını düşmana açardı. Alman ordusu bu doğal kaleleri mükemmel kullandı; her bir çalı arkasına bir makineli tüfek veya tanksavar yerleştirdiler. Müttefikler bu sorunu, tankların önüne 'dişler' (Culin Hedgerow Cutter) ekleyerek setleri parçalamayı akıl edene kadar binlerce kayıp verdiler. Bu arazi, Normandiya harekatının beklenenden çok daha yavaş ilerlemesinin ana nedenidir.",
    "whyItMatters": "Hedgerow savaşı, bir ordunun teknolojik üstünlüğünün coğrafi şartlar tarafından nasıl tamamen sıfırlanabileceğini gösterir.",
    "sources": [
      { "title": "The Bocage Warfare (U.S. Army Center of Military History)", "url": "https://history.army.mil/", "type": "official" },
      { "title": "Battle of the Hedgerows (National WWII Museum)", "url": "https://www.nationalww2museum.org/", "type": "museum" }
    ]
  },
  {
    "id": "saving-private-ryan-higgins-boat",
    "title": "Higgins Boat: Normandiya’yı Kazanan Araç",
    "subtitle": "LCVP ve sahile hücumun anatomisi.",
    "mediaType": "film",
    "mediaTitle": "Saving Private Ryan",
    "difficulty": "medium",
    "readingTimeMinutes": 5,
    "verificationStatus": "verified",
    "sourceQuality": "strong",
    "themes": ["II. Dünya Savaşı", "Mühendislik", "Denizcilik"],
    "isFlagship": false,
    "accuracyType": "real",
    "spoilerLevel": "none",
    "tags": ["saving-private-ryan", "normandiya", "higgins-boat", "teknoloji"],
    "quickRealityCheck": "Er Ryan'ı Kurtarmak filminin başında askerlerin içinden çıktığı önü açılan metal tekneler (LCVP), General Eisenhower'ın 'savaşı bizim için kazanan adam' dediği Andrew Higgins tarafından tasarlanan gerçek araçlardır.",
    "mediaChanged": "Filmde bu tekneler sadece birer taşıyıcı gibi görünür. Gerçekte bu tekneler olmasaydı, müttefiklerin limanları olmayan sığ kumsallara bu kadar büyük bir orduyu çıkarması imkansızdı.",
    "realHistory": "Higgins Boat (LCVP), aslında Louisiana bataklıklarında kereste taşımak için tasarlanmış sığ su teknelerine dayanıyordu. Ön kapağının açılması, askerlerin suya atlamadan doğrudan kumsala koşmasını sağlıyordu. Ancak bu kapağın kendisi kurşun geçirmez değildi; kapak açıldığı an askerler doğrudan karşıdaki makineli tüfek ateşine maruz kalıyordu. Filmdeki ilk sahnelerde gördüğümüz dehşet tam olarak budur. Higgins, ordunun başlangıçtaki şüphelerine rağmen bu tasarımı kabul ettirmiş ve D-Day için 20.000'den fazla tekne üretmiştir. Bu araçlar, modern amfibi savaş doktrininin temelidir.",
    "whyItMatters": "Higgins Boat, bir sivil mühendislik tasarımının savaşın sonucunu nasıl doğrudan belirleyebileceğinin en iyi örneğidir.",
    "sources": [
      { "title": "The Higgins Boat (National WWII Museum)", "url": "https://www.nationalww2museum.org/visit/museum-campus/higgins-boat-monument", "type": "museum" },
      { "title": "Eisenhower on Higgins (U.S. Navy History)", "url": "https://www.history.navy.mil/", "type": "official" }
    ]
  }
];

const updatedCards = [...cards, ...newCards];
const finalCards = Array.from(new Map(updatedCards.map(c => [c.id, c])).values());

fs.writeFileSync('data/cards.json', JSON.stringify(finalCards, null, 2));

console.log(`Phase Y.5 Batch 3 Complete: Added ${newCards.filter(c => !c.isFlagship).length} standard cards and ${newCards.filter(c => c.isFlagship).length} flagships. Total cards: ${finalCards.length}`);
