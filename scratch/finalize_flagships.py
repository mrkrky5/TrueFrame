import json

# Comprehensive Flagship Data for all 30 cards
FLAGSHIP_DATA = {
    "ac-origins-siwa": {
        "mediaChanged": "Oyunda Siwa vahasının izole ve sadece Bayek'in klanı tarafından korunan bir yer olduğu gösterilir; oysa gerçekte Siwa, Mısır ordularının ve uluslararası elçilerin sürekli ziyaret ettiği kozmopolit bir merkezdi.",
        "whyItMatters": "İskender'in Siwa'da 'Tanrı'nın Oğlu' ilan edilmesi, Batı siyasi geleneğindeki 'İlahi Krallık' kavramının temelini atmıştır."
    },
    "ac-odyssey-athens": {
        "mediaChanged": "Atina'daki polikromi (renklilik) oyunda estetik bir tercih gibi sunulur, ancak gerçekte bu renkler dini sembolizm ve siyasi güç gösterisi için hayati önemdeydi.",
        "whyItMatters": "Antik Yunan demokrasisi ve sanat anlayışı, modern Batı medeniyetinin kurumsal ve estetik DNA'sını oluşturur."
    },
    "kcd-bohemia": {
        "mediaChanged": "Sigismund'un ordusunun sadece yağmacı canavarlar gibi gösterilmesi, dönemin karmaşık dini ve siyasi meşruiyet mücadelelerini bir miktar basitleştirir.",
        "whyItMatters": "Bohemya gümüşü, Kutsal Roma İmparatorluğu'nun finansal bel kemiğiydi ve Avrupa'daki ilk büyük dini devrim olan Hussit Savaşları'nı tetikledi."
    },
    "ghost-tsushima-invasion": {
        "mediaChanged": "Samurayların 'onur' nedeniyle yeni taktiklere direndiği teması dramatik bir kurgudur; gerçekte Japonlar Moğol teknolojisine (barut vb.) hızla uyum sağlamışlardır.",
        "whyItMatters": "Moğol istilasının başarısızlığı, Japonya'da 'Kamikaze' (İlahi Rüzgar) inancını doğurmuş ve askeri ideolojiyi asırlarca şekillendirmiştir."
    },
    "rdr2-frontier": {
        "mediaChanged": "Vahşi Batı'nın sonu silahlı çatışmalardan ziyade, tel örgünün icadı ve demiryolu bürokrasisinin kurumsallaşmasıyla gelmiştir.",
        "whyItMatters": "Frontier (Sınır) dönemi, Amerikan 'bireycilik' mitinin ve mülkiyet hukuku anlayışının temelini atmıştır."
    },
    "chernobyl-disaster": {
        "mediaChanged": "Dizi teknik arızayı bir 'insan hatası' odaklı dramaya çevirir; gerçekte ise Sovyet sisteminin yapısal gizliliği ve reaktör tasarımındaki bilinen kusurlar asıl sebepti.",
        "whyItMatters": "Çernobil, nükleer güvenlik protokollerini küresel düzeyde değiştirmiş ve Sovyetler Birliği'nin çöküşünü hızlandıran siyasi bir katalizör olmuştur."
    },
    "oppenheimer-trinity": {
        "mediaChanged": "Film şahsi çekişmelere odaklansa da, Oppenheimer'ın asıl mücadelesi bilimin devlet kontrolüne girmesine karşı verdiği etik ve askeri-stratejik savaştı.",
        "whyItMatters": "Manhattan Projesi, devletin bilimi doğrudan yönettiği 'Büyük Bilim' modelini doğurmuş ve nükleer caydırıcılık çağını başlatmıştır."
    },
    "gladiator-colosseum": {
        "mediaChanged": "Commodus'un arenada ölümü kurgudur; gerçekte hamamda bir suikastla boğulmuş ve arenada yüzlerce dövüşe katılmış olsa da orada hayatını kaybetmemiştir.",
        "whyItMatters": "Gladyatör oyunları, imparatorun halkla iletişim kurduğu en güçlü siyasi kontrol ve propaganda aracıydı."
    },
    "vikings-raid": {
        "mediaChanged": "Vikinglerin İngiltere'yi 'keşfeden' ilk topluluk olduğu iddiası yanlıştır; ticaret bağları çok daha eskiydi ve akınlar sistematik bir yayılma stratejisiydi.",
        "whyItMatters": "Viking yayılması, Avrupa'nın denizcilik teknolojisini devrimleştirmiş ve İngiltere ile Rusya'nın genetik ve kültürel yapısını kalıcı olarak değiştirmiştir."
    },
    "shogun-edo": {
        "mediaChanged": "Blackthorne figürü egzotik bir gözlemci gibi sunulsa da, esin kaynağı olan William Adams gerçek bir samuray diplomatı ve Ieyasu'nun baş danışmanıydı.",
        "whyItMatters": "Edo dönemi, Japonya'nın dış dünyaya kapanarak (Sakoku) kendi özgün sanat ve idari sistemini mükemmelleştirdiği 250 yıllık bir barış çağıdır."
    },
    "ac-valhalla-vikings": {
        "mediaChanged": "Vikinglerin İngiltere'ye 'onurlu yerleşimciler' olarak geldiği anlatısı, dönemdeki acımasız esir ticaretini ve sistematik dini yağmaları bir miktar yumuşatır.",
        "whyItMatters": "Danelaw bölgesi yerleşimleri, İngiliz hukuk sistemi ve dilinde silinmez İskandinav izleri bırakmıştır."
    },
    "napoleon-rise": {
        "mediaChanged": "Napolyon'un yükselişi şahsi saplantılardan ziyade, Fransız Devrimi'nin liyakat ilkesini orduya ve hukuka (Code Napoleon) uygulamasıyla mümkün olmuştur.",
        "whyItMatters": "Napolyon kanunları, modern Avrupa hukukunun temelini atmış ve feodalizmin kıta genelinde çöküşünü hızlandırmıştır."
    },
    "the-crown-monarchy": {
        "mediaChanged": "Dizi saray içi duygusal dramaya odaklansa da, monarşinin asıl görevi yazılı olmayan anayasada devletin sürekliliğini sağlayan bir denge unsuru olmaktı.",
        "whyItMatters": "İngiliz monarşisi, modern demokraside sembolik bir birleştirici gücün nasıl kurumsallaştığının en başarılı örneğidir."
    },
    "mafia-prohibition": {
        "mediaChanged": "Suç dünyası onurlu 'aileler' gibi sunulsa da, gerçek mafya göçmen mahallelerindeki en zayıf insanları sömürerek doğan parazitik bir yapıydı.",
        "whyItMatters": "İçki Yasağı dönemi, organize suçun mahalle çetelerinden ulusal suç kartellerine nasıl evrilebileceğinin tarihi bir kanıtıdır."
    },
    "ac-mirage-baghdad": {
        "mediaChanged": "Bağdat sadece suikastların merkezi değil, 'Bilgelik Evi' ile antik bilginin korunup geliştirildiği dünyanın entelektüel başkentiydi.",
        "whyItMatters": "Abbasi Bağdat'ı, antik Yunan ve Hint bilgisini Arapçaya çevirerek modern bilimin temellerini Avrupa'dan asırlar önce atmıştır."
    },
    "ryan-higgins-boats": {
        "mediaChanged": "Omaha plajındaki kaos gerçek olsa da, bir küçük birliğin tüm Normandiya'yı tek başına kurtarması sinematik bir kahramanlık kurgusudur.",
        "whyItMatters": "D-Day çıkarması, tarihin en büyük amfibi operasyonu olup Nazi işgalinin sonunun başlangıcıdır."
    },
    "lanoire-postwar-trauma": {
        "mediaChanged": "Polis teşkilatındaki yolsuzluk oyunda kişisel bir suç dosyası gibi sunulsa da, gerçekte LAPD içinde sistemik ve kurumsal bir sorundu.",
        "whyItMatters": "Savaş sonrası Los Angeles, modern Amerikan dedektiflik yöntemlerinin ve adli tıp uygulamalarının laboratuvarı olmuştur."
    },
    "band-of-brothers-airborne": {
        "mediaChanged": "Easy Company'nin her operasyonda başrolde olması dramatik bir anlatıdır; gerçekte bu başarı binlerce anonim askerin koordineli çabasıydı.",
        "whyItMatters": "Paraşütçü birliklerin Normandiya'daki rolü, askeri tarihte dikey kuşatma taktiklerinin başarısını kanıtlamıştır."
    },
    "the-terror-arctic": {
        "mediaChanged": "Franklin seferinin kaybı doğaüstü bir yaratığa bağlansa da, gerçek sebep kurşun zehirlenmesi, açlık ve ekstrem iklim koşullarıydı.",
        "whyItMatters": "Kuzeybatı Geçidi arayışı, Arktik keşif tarihinin en trajik ve ders verici başarısızlıklarından biridir."
    },
    "300-sparta": {
        "mediaChanged": "Spartalıların zırhsız süper kahramanlar gibi gösterilmesi kurgudur; gerçekte her iki ordu da dönemin en ağır bronz zırhlarını kullanıyordu.",
        "whyItMatters": "Thermopylae savunması, Batı dünyasında 'özgürlük için feda edilen hayat' mitinin temel kaynağıdır."
    },
    "last-emperor-court-ritual": {
        "mediaChanged": "Yasak Şehir'in bir 'altın kafes' gibi sunulması doğrudur ancak Pu Yi'nin siyasi iradesizliği dönemdeki karmaşık sömürgeci güç dengelerinin bir sonucuydu.",
        "whyItMatters": "Son İmparator'un düşüşü, 2000 yıllık Çin imparatorluk geleneğinin sonu ve modern Çin'in sancılı doğumudur."
    },
    "ac-syndicate-london": {
        "mediaChanged": "Viktorya dönemi Londra'sı oyunda sadece bir macera alanı olsa da, gerçekte çocuk işçiliği ve derin sınıf farklarının olduğu karanlık bir sanayi metropolüydü.",
        "whyItMatters": "Endüstri Devrimi Londra'sı, modern şehirleşme ve işçi hakları mücadelelerinin merkez üssüdür."
    },
    "mafia-immigration-crime": {
        "mediaChanged": "İtalyan göçmenlerin otomatik olarak suça karıştığı algısı yanlıştır; suç örgütleri sadece küçük bir azınlığın yarattığı baskıcı bir yapıydı.",
        "whyItMatters": "Göçmen mahallelerindeki organize suçun kökeni, devletin ve hukukun bu bölgelerde yokluğundan beslenmiştir."
    },
    "shogun-trade-sakoku": {
        "mediaChanged": "Japonya'nın dış dünyaya tamamen kapalı olduğu sanılır; gerçekte Hollandalılar ve Çinlilerle kontrollü ama hayati bir ticaret devam ediyordu.",
        "whyItMatters": "Sakoku politikası, Japonya'nın Batı sömürgeciliğinden korunarak kendi özgün modernleşme sürecini başlatmasını sağlamıştır."
    },
    "last-kingdom-danelaw": {
        "mediaChanged": "Uhtred figürü kurgusal olsa da, onun üzerinden anlatılan Danelaw (Viking bölgesi) ve Sakson gerilimi tarihsel gerçeğe sadıktır.",
        "whyItMatters": "Alfred'in 'İngiltere' rüyası, Viking tehdidine karşı birleşen farklı Sakson krallıklarının ortak kimlik arayışıdır."
    },
    "crown-monarchy-symbol": {
        "mediaChanged": "Dizi Kraliçe'yi bir 'yalnız kadın' gibi resmeder; oysa o muazzam bir bürokratik mekanizmanın ve danışman ordusunun merkezindeydi.",
        "whyItMatters": "Modern dünyada monarşinin varlığı, siyaset üstü bir gelenek ve diplomatik 'yumuşak güç' kaynağıdır."
    }
}

def finalize_flagships():
    with open('data/cards.json', 'r', encoding='utf-8') as f:
        cards = json.load(f)
    
    count = 0
    for card in cards:
        cid = card['id']
        if cid in FLAGSHIP_DATA:
            card['mediaChanged'] = FLAGSHIP_DATA[cid]['mediaChanged']
            card['whyItMatters'] = FLAGSHIP_DATA[cid]['whyItMatters']
            card['isFlagship'] = True
            count += 1
        else:
            # Clean non-flagships
            card['isFlagship'] = False
            if 'mediaChanged' not in card: card['mediaChanged'] = ""
            if 'whyItMatters' not in card: card['whyItMatters'] = ""
            
    with open('data/cards.json', 'w', encoding='utf-8') as f:
        json.dump(cards, f, ensure_ascii=False, indent=2)
    
    print(f"Finalized {count} flagship cards with structured fields.")

if __name__ == "__main__":
    finalize_flagships()
