const fs = require('fs');
const path = 'data/cards.json';

const deepContent = `Ptolemaios dönemi Mısır'ı (M.Ö. 305 - M.Ö. 30), antik tarihin en büyüleyici ve karmaşık hibrit medeniyetlerinden biridir. Büyük İskender'in dünyayı fethetme rüyasının bir parçası olarak Mısır'a girişi, binlerce yıllık firavunluk düzenini sona erdirmemiş, aksine onu Yunan (Hellenistik) kültürüyle sentezlemiştir. İskender'in generallerinden Ptolemaios Soter tarafından kurulan hanedan, kendilerini Mısır halkına 'yabancı fatihler' olarak değil, 'yeni firavunlar' olarak sunmuştur. Bu meşruiyet arayışının kalbinde ise Siwa Vahası yatmaktadır. M.Ö. 331 yılında İskender'in bizzat çölü geçerek ulaştığı Amon Tapınağı, onun 'Zeus-Ammon'un oğlu' olduğunu ilan ederek tüm antik dünyada tanrısal bir statü kazanmasını sağlamıştır. Bu olay, Mısır'ın binlerce yıllık dini otoritesinin Yunan siyasi gücüyle birleştiği an olarak tarihe geçmiştir.

### Ekonomik Temeller ve Nil'in Gücü
Mısır'ın Ptolemaios dönemindeki en büyük gücü, Nil Nehri'nin sağladığı eşsiz tarımsal verimlilikti. Hanedan, tarım üretimini optimize etmek için muazzam bir bürokratik ağ kurmuştur. Nil deltası, sağladığı devasa tahıl üretimiyle sadece bölgeyi değil, yükselen güç Roma'nın devasa nüfusunu doyuran bir 'ekmek sepeti' (breadbasket) işlevi görüyordu. Vergi sistemi o kadar detaylıydı ki, her bir palmiye ağacı, her bir küçükbaş hayvan ve her bir dönüm arazi kayıt altına alınmıştı. 'Ekonomi' kelimesinin antik kökenlerine uygun olarak, hane yönetimi devlet yönetimiyle birleşmişti. Mısır'ın altın, fildişi ve baharat ticaret yolları üzerindeki konumu, İskenderiye'yi dünyanın en zengin şehri haline getirmişti.

### İskenderiye: Antik Dünyanın Bilim Başkenti
İskenderiye, o dönemin entelektüel merkeziydi. İskenderiye Kütüphanesi (Mouseion), dünyanın dört bir yanından gelen elyazmalarına ev sahipliği yapıyordu. Burası sadece bir kitap deposu değil, tıp, astronomi, coğrafya ve matematik alanında devrimlerin yapıldığı bir araştırma merkeziydi. Eratosthenes'in dünyanın çevresini hesapladığı, Öklid'in geometrinin temellerini attığı ve Herofilos'un ilk sistematik otopsileri yaptığı yer burasıydı. Şehrin limanında yükselen Pharos Feneri ise, antik dünyanın yedi harikasından biri olarak hem gemicilere yol gösteriyor hem de insanlığın mühendislik dehasını simgeliyordu. Ancak mermer sarayların ve bilim binalarının ardında, yerli Mısırlıların Yunan yönetimine karşı duyduğu derin bir huzursuzluk vardı.

### Sosyal Hiyerarşi ve Kimlik Çatışması
Ptolemaios dönemi sosyal yapısı oldukça katı ve katmanlıydı. En üstte Grek asıllı yönetici sınıf yer alıyordu; bunlar idari ve askeri pozisyonları ellerinde tutuyorlardı. Ortada Helenleşmiş Mısırlılar, Yahudiler ve diğer Akdenizli tüccarlar bulunuyordu. En altta ise tarlalarda çalışan, ağır vergiler ödeyen ve kendi geleneksel dillerini konuşan köylü Mısırlılar yer alıyordu. Bu sınıfsal ayrım, dilde de kendini gösteriyordu; yönetim ve bilim dili Grekçe iken, halk Demotik Mısırça ve Kıpti dillerini konuşmaya devam ediyordu. Kleopatra'nın tarihteki gerçek büyüklüğü, Ptolemaios hanedanında Mısırça konuşmayı öğrenen ilk ve tek hükümdar olmasıdır. Bu, halkla doğrudan bağ kurmak için yapılmış dahi bir siyasi hamleydi.

### Dini Sentez: Serapis ve Eski Tanrılar
Ptolemaioslar, Mısır halkının desteğini almak için dini bir sentez yarattılar. Baş tanrı Serapis, hem Mısır'ın Osiris ve Apis inançlarını hem de Yunan tanrılarının özelliklerini taşıyan yapay bir tanrıydı. Ancak yerli halk, binlerce yıllık dini geleneklerini korumaya çalıştı. Tapınak yapımı bu dönemde zirveye ulaştı; bugün turistlerin hayranlıkla izlediği Edfu ve Dendera tapınakları aslında bu 'son Mısır' döneminin eserleridir. Bu tapınaklar, Mısır kültürünün Yunan etkisi altında ezilmek yerine, onu bir şekilde bünyesine alarak hayatta kaldığının kanıtlarıdır.

### Roma'nın Gölgesi ve Kleopatra'nın Sonu
Assassin's Creed Origins'in tasvir ettiği M.Ö. 49 yılı, bu 300 yıllık hanedanın son ve en sancılı günlerine denk gelir. Kleopatra ve kardeşi XIII. Ptolemaios arasındaki iç savaş, Mısır'ın bağımsızlığının son çırpınışlarıdır. Julius Caesar'ın İskenderiye'ye gelişi ve Kleopatra ile olan ittifakı, Mısır'ın kaderini Roma'nın iç çekişmelerine kalıcı olarak bağlamıştır. Actium Savaşı'ndaki (M.Ö. 31) yenilginin ardından Kleopatra'nın intiharı, firavunlar devrinin resmen sona ermesi ve Mısır'ın Roma'nın bir 'şahsi mülkü' haline gelmesi demektir. Bu geçiş, antik dünyanın en uzun süreli medeniyetlerinden birinin sessizce tarih sahnesinden çekilmesi anlamına geliyordu. Bayek karakteri üzerinden anlatılan Medjay sınıfının yok oluşu, aslında eski dünyanın bu kaçınılmaz yeni düzene kurban edilişinin bir metaforudur.`;

let cards = JSON.parse(fs.readFileSync(path, 'utf8'));
const cardIndex = cards.findIndex(c => c.id === 'ac-origins-siwa');
if (cardIndex !== -1) {
  cards[cardIndex].realHistory = deepContent;
  fs.writeFileSync(path, JSON.stringify(cards, null, 2), 'utf8');
  console.log('Enriched ac-origins-siwa to ultra-deep levels.');
}
