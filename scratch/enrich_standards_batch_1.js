const fs = require('fs');
const path = 'data/cards.json';

const enrichmentData = {
  "london-fire-plague": {
    "quickRealityCheck": "Gerçek. 1665 Vebası ve 1666 Büyük Londra Yangını, şehri kökten değiştiren iki ardışık felakettir.",
    "mediaChanged": "Filmlerde genellikle yangın ve veba tek bir kaotik olay gibi gösterilir. Gerçekte veba yangından bir yıl önce zirve yapmıştı ve yangın, ironik bir şekilde vebayı taşıyan farelerin ve pirelerin yaşam alanlarını yok ederek salgının bitmesine yardımcı olmuştur.",
    "realHistory": "1665 yılındaki Büyük Veba, Londra nüfusunun yaklaşık dörtte birini (100.000 kişi) yok etmiştir. Şehir hala bu travmayı atlatmaya çalışırken, 2 Eylül 1666'da bir fırında başlayan yangın, ahşap binalardan oluşan şehri 4 gün içinde kül etmiştir. Yangın, 13.000 evi ve St. Paul Katedrali dahil 87 kiliseyi yok etmiştir. Ancak bu yıkım, Christopher Wren gibi mimarların şehri modern, geniş caddelerle ve taş binalarla yeniden inşa etmesine olanak tanımıştır. Yangın sonrası çıkarılan 'Bina Yasaları', bugünkü Londra'nın mimari karakterini belirlemiştir.",
    "whyItMatters": "Londra Yangını, modern şehirciliğin ve yangın sigortacılığının doğuşunu tetikleyen en büyük kentsel laboratuvardır."
  },
  "constantinople-fall-turning-new": {
    "quickRealityCheck": "Gerçek. 1453 yılında İstanbul'un fethi, Orta Çağ'ın sonu ve Yeni Çağ'ın başlangıcı kabul edilen küresel bir olaydır.",
    "mediaChanged": "Medya genellikle fethi sadece bir askeri kuşatma olarak gösterir. Gerçekte fethin en büyük etkisi, Bizanslı alimlerin İtalya'ya kaçarak Rönesans'ı tetiklemesi ve ticaret yollarının değişmesiyle Coğrafi Keşiflerin başlamasıdır.",
    "realHistory": "II. Mehmed (Fatih) liderliğindeki Osmanlı ordusu, o dönemin en ileri top teknolojisini (Şahi topları) kullanarak aşılmaz sanılan Bizans surlarını yıkmıştır. İstanbul'un fethi, İpek ve Baharat yollarının kontrolünün Osmanlı'ya geçmesiyle Avrupalıların yeni deniz yolları aramasına (Vasco da Gama ve Kolomb) neden olmuştur. Ayrıca fetihten sonra İstanbul, çok kültürlü ve çok dinli bir imparatorluk başkenti olarak yeniden imar edilmiş, 'Cihan Şümul' bir vizyonun merkezi olmuştur. Bu olay, Avrupa'da feodalitenin zayıflamasına ve merkezi krallıkların güçlenmesine de dolaylı olarak katkı sağlamıştır.",
    "whyItMatters": "İstanbul'un fethi, doğu ve batı arasındaki dengeleri değiştirerek modern dünyanın jeopolitik temellerini atmıştır."
  },
  "ancient-roman-day": {
    "quickRealityCheck": "Gerçek. Bir Roma vatandaşının günü, modern yaşamla şaşırtıcı benzerlikler taşır; iş, yemek, spor ve eğlence üzerine kuruluydu.",
    "mediaChanged": "Dizilerde Romalılar sürekli ya savaşta ya da sefahattedir. Gerçekte sıradan bir vatandaş (Plebler), şafak vaktinde kalkıp akşamüstüne kadar çalışır, ardından ücretsiz halk hamamlarına giderek sosyalleşirdi.",
    "realHistory": "Romalılar için gün 'Salutatio' (himiye altındaki kişilerin patronlarını ziyareti) ile başlardı. Ardından Forum'da işler halledilir, ticaret yapılırdı. Öğleden sonra iş biter ve tüm şehir 'Thermae' adı verilen hamamlara akın ederdi. Hamamlar sadece temizlik değil, aynı zamanda kütüphanelerin ve spor alanlarının bulunduğu devasa sosyal kulüplerdi. Akşam yemeği (Cena), ailenin ve dostların bir araya geldiği en önemli ritüeldi. Roma'da hayat, 'Annona' (bedava tahıl) ve 'Circenses' (eğlenceler) sayesinde, işsiz kitlelerin bile bir rutine ve temel ihtiyaçlara sahip olduğu organize bir sistemdi.",
    "whyItMatters": "Roma günlük yaşamı, modern 'kentsel yaşam' modelinin (sosyal alanlar, organize çalışma saatleri, devlet yardımları) ilk başarılı prototipidir."
  },
  "marco-polo-court": {
    "quickRealityCheck": "Yüksek Doğruluk. Marco Polo'nun 13. yüzyılda Kubilay Han'ın sarayında geçirdiği 17 yıl tarihsel bir gerçektir.",
    "mediaChanged": "Dizilerde Marco Polo bir savaşçı veya casus gibi gösterilir. Gerçekte Marco Polo, Kubilay Han'ın güvenini kazanan bir 'elçi' ve 'vali' olarak imparatorluğun uzak köşelerine vergi ve raporlama görevleri için gönderilmiştir.",
    "realHistory": "Venedikli tüccar Marco Polo, İpek Yolu'nu geçerek Çin'e (Cathay) ulaşan ilk batılılardan biridir. Kubilay Han'ın sarayında karşılaştığı kağıt para, kömür kullanımı, posta sistemi ve muazzam kentsel düzen, o dönemin Avrupa'sının çok ilerisindeydi. Polo, hatıralarında Han'ın sarayındaki görkemi ve Moğol-Çin bürokrasisinin işleyişini detaylarıyla anlatmıştır. Bu seyahatname, Avrupa'da Doğu'ya olan ilgiyi artırmış ve yüzyıllar sonra Kristof Kolomb gibi kaşiflere ilham kaynağı olmuştur. Moğol barışı (Pax Mongolica) sayesinde ticaretin güvenli hale gelmesi, Polo'nun bu uzun yolculuğu yapabilmesini sağlayan asıl etkendir.",
    "whyItMatters": "Marco Polo'nun gözlemleri, Doğu ve Batı arasındaki ilk büyük kültürel ve ekonomik köprüdür; Avrupa'nın dünya görüşünü kalıcı olarak genişletmiştir."
  },
  "silk-road-travel-new": {
    "quickRealityCheck": "Gerçek. İpek Yolu tek bir yol değil, Çin ile Akdeniz'i birbirine bağlayan devasa bir ticaret ve fikir ağıydı.",
    "mediaChanged": "Genellikle sadece ipek taşıyan kervanlar gösterilir. Gerçekte bu yoldan sadece ipek değil; kağıt, barut, dinler (Budizm, İslam), diller ve hatta veba gibi hastalıklar da taşınmıştır.",
    "realHistory": "İpek Yolu üzerinde her 30-40 kilometrede bir yer alan Kervansaraylar, antik dünyanın 'lojistik merkezleri'ydi. Tüccarlar burada güvenle konaklıyor, hayvanlarını dinlendiriyor ve farklı milletlerden insanlarla bilgi alışverişinde bulunuyorlardı. Bu yol, sadece bir ticaret rotası değil, aynı zamanda ilk 'küreselleşme' hareketiydi. Semerkant ve Buhara gibi şehirler, bu yol sayesinde bilim ve sanat merkezlerine dönüşmüştür. İpek Yolu, deniz yollarının keşfiyle önemini kaybetse de, yüzyıllar boyunca insanlık tarihinin en büyük kültürel laboratuvarı olarak kalmıştır.",
    "whyItMatters": "İpek Yolu, farklı medeniyetlerin birbirini tanımasını sağlayarak dünya kültür mirasının en önemli harcını oluşturmuştur."
  },
  "early-islamic-expansion": {
    "quickRealityCheck": "Gerçek. 7. yüzyıldaki hızlı İslam yayılması, Bizans ve Sasani imparatorluklarının zayıfladığı bir siyasi vakumda gerçekleşmiştir.",
    "mediaChanged": "Savaşlar genellikle sadece dini bir motivasyonla gösterilir. Gerçekte Bizans ve Sasani arasındaki 30 yıllık yıkıcı savaşlar her iki tarafı da bitirmiş, halkı ağır vergi yüküyle ezmişti; bu durum İslam ordularının 'kurtarıcı' olarak görülmesini sağlamıştır.",
    "realHistory": "İslam orduları, özellikle Yarmuk (636) ve Kadisiye (636) savaşlarıyla dönemin iki süper gücünü mağlup etmiştir. Bu yayılma, sadece askeri bir başarı değil, aynı zamanda yeni bir idari ve hukuki sistemin (Dhimmi sistemi) getirilmesidir. Gayrimüslim tebaa, cizye vergisi karşılığında inanç özgürlüğü ve askeri koruma elde etmiştir. Bu hoşgörü politikası, fethedilen topraklarda direnişin düşük olmasını ve İslam kültürünün hızla yerleşmesini sağlamıştır. Bağdat, Şam ve Kurtuba gibi şehirler, bu yeni imparatorluğun entelektüel ve ekonomik merkezleri haline gelmiştir.",
    "whyItMatters": "Erken İslam fetihleri, antik dünyanın jeopolitik haritasını tamamen silip süpürerek bugünkü Orta Doğu ve Akdeniz kimliğinin temelini atmıştır."
  },
  "baghdad-daily-life-new": {
    "quickRealityCheck": "Gerçek. 9. yüzyıl Bağdat'ı, refah düzeyi, temizliği ve bilimsel canlılığıyla dünyanın en gelişmiş metropolüydü.",
    "mediaChanged": "Genellikle sadece saray hayatı gösterilir. Gerçekte Bağdat, her mahallesinde kütüphaneleri, fırınları, hastaneleri ve kanalizasyon sistemi olan muazzam bir kentsel planlamaya sahipti.",
    "realHistory": "Halife Harun Reşid dönemindeki Bağdat, her dinden ve milletten insanın bir arada yaşadığı bir 'kozmopolis'ti. Dicle nehri üzerindeki köprüler, hareketli pazarlar (Souq) ve dünyanın her yerinden gelen gemiler şehrin ekonomik gücünü gösteriyordu. Bilgelik Evi (Beytü'l Hikme) sayesinde şehir, antik bilgiyi modern bilime dönüştürüyordu. Halkın eğitimi için medreseler ve bedava sağlık hizmeti veren 'Bimaristan'lar (hastaneler) o dönem için devrim niteliğindeydi. Bağdat'ta yaşayan sıradan bir vatandaş, temiz suya, ucuz kağıda (kağıt fabrikaları sayesinde) ve geniş bir gıda çeşitliliğine erişebiliyordu.",
    "whyItMatters": "Altın Çağ Bağdat'ı, kentsel planlama ve sosyal hizmetlerin bilimsel gelişimle nasıl at başı gidebileceğinin tarihteki en parlak örneğidir."
  },
  "kingdom-of-heaven-crusades": {
    "quickRealityCheck": "Yüksek Doğruluk. 1187 yılında Kudüs'ün Selahaddin Eyyubi tarafından geri alınması ve Hittin Savaşı, tarihsel kayıtlara çok uygundur.",
    "mediaChanged": "Filmde Balian bir demirci olarak başlar; gerçekte o bir asilzade ve deneyimli bir komutandı. Ayrıca Selahaddin ile olan ilişkisi drama için daha kişisel hale getirilmiştir.",
    "realHistory": "Hittin Savaşı (1187), Haçlı ordularının susuzluk ve taktiksel hatalar nedeniyle Selahaddin karşısında tamamen yok edildiği andır. Kudüs'ün düşüşü, Avrupa'da şok etkisi yaratmış ve 3. Haçlı Seferi'ni tetiklemiştir. Selahaddin Eyyubi'nin şehri aldığında Hristiyan halka gösterdiği merhamet, 1099'daki Haçlı katliamıyla zıtlık oluşturur ve İslam savaş ahlakının en önemli örneği kabul edilir. Bu dönemde kurulan Tapınak Şövalyeleri ve Hospitalier gibi askeri tarikatlar, Haçlı devletlerinin savunmasında ve finansal sistemin gelişiminde kritik rol oynamışlardır.",
    "whyItMatters": "Kudüs'ün 1187'de el değiştirmesi, Haçlı ideolojisinin zayıflamasına ve Doğu-Batı ilişkilerinde askeri gücün yanında diplomatik dengelerin de önem kazanmasına yol açmıştır."
  },
  "witch-hunts-period": {
    "quickRealityCheck": "Yanılgı. Cadı avları sanılanın aksine Orta Çağ'da değil, Rönesans ve Erken Modern dönemde (15.-17. yüzyıl) zirve yapmıştır.",
    "mediaChanged": "Filmlerde cadı avları karanlık ve cahil Orta Çağ'da gösterilir. Gerçekte bu, devletlerin ve kiliselerin güç mücadelesi verdiği, dini savaşların (Reformasyon) yaşandığı ve toplumsal gerilimin arttığı 'Aydınlanma' öncesi dönemde yaygındı.",
    "realHistory": "Cadı avlarının arkasındaki asıl nedenler; Küçük Buzul Çağı'nın yarattığı kıtlıklar, veba salgınları ve Katolik-Protestan çatışmalarıdır. İnsanlar, yaşadıkları talihsizliklere (hayvanların ölmesi, ekinlerin solması) günah keçisi arıyorlardı. Engizisyon mahkemeleri sanılanın aksine cadı avlarına daha temkinli yaklaşırken, yerel sivil mahkemeler daha acımasızdı. Yaklaşık 40.000-60.000 kişi (çoğunluğu kadın) bu süreçte hayatını kaybetmiştir. Bu dönem, aynı zamanda kadınların toplumsal ve ekonomik rollerinin kısıtlandığı bir süreci de temsil eder.",
    "whyItMatters": "Cadı avları, kitlesel histeri ve 'düşman yaratma' psikolojisinin tarihteki en kanlı ve organize örneklerinden biridir."
  },
  "1917-trenches": {
    "quickRealityCheck": "Yüksek Doğruluk. I. Dünya Savaşı'ndaki siper hayatı, fareler, çamur, hastalıklar ve 'No Man's Land' dehşeti gerçeğe çok yakındır.",
    "mediaChanged": "Dizilerde genellikle sadece büyük hücumlar gösterilir. Gerçekte siper hayatı, aylarca süren can sıkıntısı, uykusuzluk ve keskin nişancı korkusuyla geçen bir bekleyişti.",
    "realHistory": "I. Dünya Savaşı'nda kullanılan makineli tüfekler ve ağır toplar, askerleri yerin altına girmeye zorlamıştır. Siperler; sadece çukurlar değil, içinde mutfaklar, hastaneler ve yatakhaneler olan devasa yeraltı labirentleriydi. 'Siper Ayağı' (Trench Foot) gibi hastalıklar, sürekli çamur ve su içinde kalmaktan dolayı binlerce askerin uzvunu kaybetmesine neden olmuştur. Savaşın doğasını değiştiren tanklar, işte bu siper kilitlenmesini kırmak için tasarlanmıştır. 1917 yılına gelindiğinde, ordularda büyük disiplin sorunları başlamış ve savaşın anlamsızlığına dair güçlü bir karşı duruş (siper edebiyatı) doğmuştur.",
    "whyItMatters": "Siper savaşı, modern savaş teknolojisinin insan psikolojisi ve bedeni üzerindeki yıkıcı etkisinin en somut dökümanıdır."
  },
  "prestige-currents": {
    "quickRealityCheck": "Gerçek. Nikola Tesla (AC) ve Thomas Edison (DC) arasındaki 'Akımlar Savaşı', elektrik dünyasının geleceğini belirleyen gerçek bir rekabettir.",
    "mediaChanged": "Filmde sihir ve Tesla'nın kopyalama makinesi kurgudur. Gerçekte Tesla bir sihirbaz değil, vizyoner bir mühendisti; Edison ise bir mucitten ziyade acımasız bir iş insanıydı.",
    "realHistory": "1880'lerin sonunda Edison, doğru akımın (DC) güvenli olduğunu savunurken, Tesla ve George Westinghouse alternatif akımın (AC) enerjiyi uzak mesafelere çok daha verimli taşıyabildiğini kanıtlamıştır. Edison, AC'yi kötülemek için sokak hayvanlarını elektrikle öldürmek gibi karalama kampanyaları yürütmüştür. Ancak 1893 Chicago Dünya Fuarı'nın ve ardından Niagara Şelalesi barajının AC ile aydınlatılması, savaşı Tesla'nın kazanmasını sağlamıştır. Bu zafer, bugünkü modern enerji şebekemizin temelini oluşturmuştur.",
    "whyItMatters": "Akımlar Savaşı, sadece bir teknoloji yarışı değil, patentlerin, sermayenin ve inovasyonun modern iş dünyasını nasıl şekillendirdiğinin ilk büyük örneğidir."
  },
  "spartan-war-machines-myth": {
    "quickRealityCheck": "Kısmen Gerçek. Spartalılar profesyonel bir orduya sahipti; ancak sadece 'savaşçı' değil, aynı zamanda çok muhafazakar bir toprak sahibi sınıfıydılar.",
    "mediaChanged": "300 Ispartalı gibi filmlerde Spartalılar yarı çıplak ve sadece kılıç sallayan devler gibi gösterilir. Gerçekte ağır zırhlı hoplitler olarak sıkı bir 'Phalanx' düzeninde, disiplinli bir birlik olarak savaşırlardı.",
    "realHistory": "Sparta toplumu, 'Helot' adı verilen köleleştirilmiş bir yerli nüfusun emeği üzerine kuruluydu. Spartalı vatandaşlar (Spartiate), Helot isyanlarını önlemek için sürekli bir askeri eğitim (Agoge) altında yaşıyorlardı. Bu eğitim 7 yaşında başlar ve 30 yaşına kadar sürerdi. Sparta, Yunan dünyasının en güçlü kara ordusuna sahipti ama aynı zamanda değişime en kapalı şehriydi. Sanat ve felsefe Atina'da gelişirken, Sparta'da sadece askeri disiplin ve lakonik (kısa ve öz) konuşma sanatı yüceltilirdi. Onların düşüşü, değişen dünyaya ayak uyduramamalarından ve nüfuslarının giderek azalmasından kaynaklanmıştır.",
    "whyItMatters": "Sparta modeli, tarihteki ilk 'topyekün militarist toplum' deneyi olarak siyaset bilimi ve askeri tarih için eşsiz bir inceleme konusudur."
  },
  "pirate-maps-myth": {
    "quickRealityCheck": "Yanılgı. Korsanların hazine haritaları çizdiği ve hazinelerini gömdüğü fikri büyük oranda Robert Louis Stevenson'ın 'Define Adası' kitabından doğan bir edebiyat mitidir.",
    "mediaChanged": "Korsanların sürekli hazine peşinde haritalarla dolaştığı gösterilir. Gerçekte korsanlar kazandıkları parayı hızla liman şehirlerinde harcarlar, geleceğe yatırım yapmazlardı.",
    "realHistory": "Korsanların çoğu, donanmadan kaçmış veya işsiz kalmış denizcilerdi. Onların asıl hazinesi altın değil; gemi ekipmanları, yiyecek, içki ve ilaç gibi temel ihtiyaçlardı. Gemilerinde katı bir demokratik sistem (Korsan Kodu) uygularlardı; kaptan sadece savaş anında tam yetkiliydi ve ganimet eşit paylaştırılırdı. Kaptan Kidd gibi sadece birkaç örneğin hazine gömdüğü bilinmektedir; o da parayı saklamak için değil, mahkemede pazarlık kozu olarak kullanmak için yapmıştır. Korsanlık, aslında deniz ticaretinin düzensiz ve devlet otoritesinin zayıf olduğu bölgelerde doğan bir ekonomik hayatta kalma biçimiydi.",
    "whyItMatters": "Korsanlık mitleri, gerçek yasadışı yaşamın zorluklarını ve ekonomik nedenlerini gizleyen romantik bir kurgu katmanı oluşturmuştur."
  },
  "nero-fiddling-myth": {
    "quickRealityCheck": "Yanılgı. M.S. 64 yılındaki büyük Roma yangını sırasında Nero'nun 'lir çalıp şarkı söylediği' iddiası, düşmanları tarafından uydurulmuş bir siyasi karalamadır.",
    "mediaChanged": "Nero genellikle yangını izlerken zevkten dört köşe olan bir deli gibi resmedilir. Gerçekte yangın sırasında 50 km uzaktaki Antium'daydı ve haberi alır almaz Roma'ya dönüp yardım çalışmalarını bizzat yönetmiştir.",
    "realHistory": "Yangından sonra Nero, evsiz kalanlar için saray bahçelerini açmış ve gıda yardımı organize etmiştir. Hatta şehrin daha geniş caddelerle ve yangına dayanıklı malzemelerle yeniden inşası için yeni yasalar çıkarmıştır. Ancak yangın sonrası inşa ettiği devasa sarayı (Domus Aurea), halkın tepkisini çekmiş ve yangını 'saray için yer açmak amacıyla' kendisinin çıkardığı dedikodusuna yol açmıştır. Nero da suçu üzerinden atmak için o dönemde henüz yeni ve sevilmeyen bir azınlık olan Hristiyanları suçlamış ve tarihteki ilk büyük Hristiyan zulmünü başlatmıştır.",
    "whyItMatters": "Nero miti, tarihin kazananlar (veya sonraki tarihçiler) tarafından nasıl manipüle edilebileceğinin en klasik örneğidir."
  },
  "rome-series-spectacle": {
    "quickRealityCheck": "Gerçek. Roma'da halkı eğlendirmek (Spectacula), siyasi meşruiyet kazanmanın ve toplumsal barışı korumanın birincil yoluydu.",
    "mediaChanged": "Genellikle sadece kanlı dövüşler gösterilir. Gerçekte bu gösteriler arasında tiyatrolar, mim gösterileri, dini ritüeller ve bedava ziyafetler de vardı; yani çok daha kapsamlı bir 'eğlence festivali' niteliğindeydi.",
    "realHistory": "Romalı yöneticiler, halkın karnını 'Annona' (bedava buğday) ile doyururken, zihinlerini de devasa arenalarda meşgul tutuyorlardı. Chariot yarışları (at arabası yarışları), Circus Maximus'ta 200.000 kişiyi bir araya getiren ve bugünkü fanatizmle yarışan bir tutkuydu. Mavi, Yeşil, Kırmızı ve Beyaz takımlar sadece birer spor ekibi değil, siyasi birer grup gibiydi. Bu devasa organizasyonlar, Roma toplumunun her kesimini bir araya getirerek 'Romalı olma' hissini pekiştiriyordu. Spectacula, aslında bir devletin kendi vatandaşlarını pasifize etme ve kontrol etme sanatının zirvesidir.",
    "whyItMatters": "Roma gösteri kültürü, bugünkü modern spor endüstrisinin ve kitle eğlence anlayışının sosyolojik atasıdır."
  },
  "bf1-harlem-hellfighters": {
    "quickRealityCheck": "Gerçek. 369. Piyade Alayı (Harlem Hellfighters), I. Dünya Savaşı'nda hem ırkçılıkla hem de Almanlarla savaşan kahraman bir siyah birliğidir.",
    "mediaChanged": "Battlefield 1 oyununda bu birlik merkezi bir rol oynar. Ancak oyunda gösterilmeyen asıl mücadele, ABD ordusunun onları beyazlarla birlikte savaştırmak istememesi ve bu yüzden Fransız ordusuna 'ödünç' vermesidir.",
    "realHistory": "Hellfighters, cephede 191 gün kalarak herhangi bir Amerikan birliğinden daha uzun süre savaşmıştır. Hiçbir askeri esir düşmemiş ve hiçbir mevziyi kaybetmemişlerdir. Fransızlar tarafından en yüksek onur nişanı olan 'Croix de Guerre' ile ödüllendirilmişlerdir. Amerika'ya döndüklerinde ise, kazandıkları askeri başarıya rağmen hala ırkçı saldırılara ve ayrımcılığa maruz kalmışlardır. Ancak bu birliğin cesareti, ABD'de siyahların sivil haklar mücadelesinde (Civil Rights) dönüm noktalarından biri olmuştur. Ayrıca yanlarında getirdikleri askeri bando ile Avrupa'yı Caz (Jazz) müziğiyle tanıştırmışlardır.",
    "whyItMatters": "Harlem Hellfighters, askeri başarının toplumsal önyargıları kırmadaki gücünün ve haksızlığa karşı onurlu bir direnişin sembolüdür."
  },
  "persian-empire-admin": {
    "quickRealityCheck": "Gerçek. Ahameniş İmparatorluğu, tarihteki ilk gerçek 'süper güç'tür ve devasa topraklarını benzersiz bir idari sistemle yönetmiştir.",
    "mediaChanged": "300 filminde Persler bir canavar ordusu gibi gösterilir. Gerçekte Persler; posta sistemini kuran, yolları güvenli hale getiren, farklı dinlere ve dillere saygı duyan son derece sofistike bir medeniyetti.",
    "realHistory": "Büyük Kiros'un kurduğu imparatorluk, 'Satraplık' adı verilen eyalet sistemine dayanıyordu. Her satrap (vali) yerel yasaları koruyor, ancak merkeze vergi ödüyordu. 'Kraliyet Yolu' (Royal Road) sayesinde haberler binlerce kilometreyi birkaç günde geçebiliyordu. Perslerin en büyük başarısı, tebaasını zorla Persleştirmek yerine, onlara dini ve kültürel özerklik tanımasıydı (Örn: Babil'deki Yahudilerin serbest bırakılması). Bu hoşgörü ve bürokratik zeka, imparatorluğun o güne kadar görülmemiş bir alanda 200 yıl boyunca istikrarla yönetilmesini sağlamıştır.",
    "whyItMatters": "Pers idari modeli, daha sonra Büyük İskender ve Roma İmparatorluğu tarafından kopyalanacak olan 'küresel imparatorluk' yönetiminin temel taşıdır."
  },
  "pentiment-printing-press": {
    "quickRealityCheck": "Gerçek. Gutenberg'in matbaayı icadı (1450'ler), bilginin demokratikleşmesini ve modern dünyanın kapılarının açılmasını sağlamıştır.",
    "mediaChanged": "Pentiment oyununda matbaa, yazmaların estetik güzelliğini yok eden bir 'soğuk makine' gibi de algılanır. Gerçekte matbaa, sadece hızı artırmamış, bilginin doğrulanabilirliğini ve saklanabilirliğini devrimsel bir boyuta taşımıştır.",
    "realHistory": "Matbaadan önce bir kitabın yazılması aylar sürüyordu ve sadece kilise veya çok zenginlerin erişimindeydi. Matbaa ile birlikte kitap fiyatları düştü ve okuryazarlık hızla yayıldı. Martin Luther'in İncil'i Almancaya çevirip matbaada çoğaltması, Reformasyon hareketinin ve din savaşlarının fitilini ateşlemiştir. Matbaa olmasaydı, ne Rönesans ne de Bilimsel Devrim bu kadar geniş kitlelere ulaşabilirdi. Bu, insanlık tarihindeki ilk gerçek 'bilgi patlaması'dır ve sansürün artık imkansız hale geldiği yeni bir çağın başlangıcıdır.",
    "whyItMatters": "Matbaa, bilginin bir azınlığın kontrolünden çıkıp halkın malı olmasını sağlayarak modern demokrasinin ve özgür düşüncenin önünü açmıştır."
  },
  "lanoire-policing": {
    "quickRealityCheck": "Gerçek. 1940'lar LAPD'si, hem askeri disiplini hem de sistematik yolsuzluğuyla tarihin en tartışmalı polis teşkilatlarından biridir.",
    "mediaChanged": "Oyunda polisler her zaman kravatlı ve disiplinli görünür. Gerçekte teşkilat içinde rüşvet, mafya ile işbirliği ve kanıt karartma o kadar yaygındı ki, dürüst bir dedektifin hayatta kalması imkansıza yakındı.",
    "realHistory": "II. Dünya Savaşı sonrası Los Angeles, hızla büyüyen ama polisiye altyapısı bu hıza yetişemeyen bir şehirdi. Polis memurlarının çoğu savaştan dönmüş askerlerdi ve 'sert müdahale' kültürünü sokaklara taşımışlardı. 1947'deki Siyah Dahlia davası, teşkilatın hem beceriksizliğini hem de medyanın soruşturmaları nasıl manipüle ettiğini göstermiştir. William Parker'ın şef olmasıyla teşkilat profesyonelleşmeye başlamış olsa da, bu süreçte azınlıklara uygulanan şiddet ve kurumsal ırkçılık LAPD'nin üzerine yapışan ve onlarca yıl temizlenemeyen bir leke olarak kalmıştır.",
    "whyItMatters": "1940'lar Los Angeles polisi, modern 'profesyonel polislik' ile 'kurumsal yolsuzluk' arasındaki ince ve tehlikeli çizginin en iyi örneğidir."
  },
  "sengoku-japan-hostage": {
    "quickRealityCheck": "Gerçek. Sengoku döneminde (1467-1603) rakip klanlar arasında barışı sağlamak için aile fertlerini rehine (O-kumi) verme geleneği çok yaygın ve kurumsal bir sistemdi.",
    "mediaChanged": "Rehinelik genellikle bir hapis hayatı gibi gösterilir. Gerçekte rehineler, gittikleri sarayda soylu muamelesi görür, eğitim alır ve bazen kendi klanlarından daha iyi koşullarda yaşarlardı; ancak sadakat bozulduğunda ilk kurban edilirlerdi.",
    "realHistory": "En ünlü rehine, daha sonra Japonya'yı birleştirecek olan Tokugawa Ieyasu'dur. Çocukluğunu rakip klanların yanında rehine olarak geçiren Ieyasu, bu süreci rakiplerini tanımak ve siyasi manevralar öğrenmek için bir fırsata dönüştürmüştür. Rehinelik sistemi, sadece korku üzerine değil, klanlar arası 'kan bağı' ve kültürel entegrasyon üzerine kuruluydu. Bir klanın lideri, oğlunu başka bir klana rehine verdiğinde, aslında o klanın geleceğini rehin almış oluyordu. Bu sistem, Sekigahara Savaşı'na kadar Japonya'daki kırılgan ittifakların ana koruyucusu olmuştur.",
    "whyItMatters": "Sengoku rehinelik geleneği, güvenin olmadığı bir ortamda siyasi istikrarın nasıl 'insan hayatı teminatıyla' kurulabileceğinin en uç örneğidir."
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
console.log(`Enriched ${count} standard cards successfully according to the new protocol.`);
