const fs = require('fs');
const path = 'data/cards.json';

const extraParagraphs = {
  "rdr2-frontier": "\n\n### Modern Hukuk ve Vahşi Batı'nın Mirası\nVahşi Batı'nın sona ermesi, Amerika'da sadece yasaların gelmesi değil, aynı zamanda mülkiyet haklarının ve kurumsal hukukun bireysel gücün önüne geçmesidir. Eski kanun kaçaklarının birçoğu, yeni kurulan eyaletlerde polis şerifi veya belediye başkanı olarak görev almış, yani sistemin dışından içine dahil olmuşlardır. Bu geçiş, Amerikan toplumsal belleğinde 'kendi kendine yeten birey' mitini yaratmış olsa da, gerçekte devlet otoritesinin kıtayı tamamen evcilleştirmesinin hikayesidir. Bugün bile Amerikan kültüründeki bireysel özgürlük tartışmaları, 1899'da kapanan o sınırın ve Arthur Morgan gibi figürlerin sessizce çekildiği o tozlu yolların mirasını taşır.",
  "chernobyl-disaster": "\n\n### Sosyolojik Etki ve Yeni Bir Nesil\nÇernobil, sadece o anı yaşayanları değil, 'Çernobil Çocukları' olarak bilinen koca bir neslin sağlık ve psikolojik durumunu da etkilemiştir. Ukrayna ve Belarus'ta radyasyon korkusuyla büyüyen bu nesil, çevreci hareketlerin ve şeffaf yönetim taleplerinin motor gücü olmuştur. Felaket, devletin 'yanılmazlık' imajını yerle bir ederek, sivil toplumun ve bağımsız bilimsel denetimin önemini kanıtlamıştır. Bu sosyolojik kırılma, Doğu Bloku'ndaki demokratikleşme süreçlerini hızlandıran en önemli 'sessiz' etkendir. Çernobil, tarihte teknik bir kazanın bir imparatorluğu nasıl temelinden sarstığının en somut ve hüzünlü laboratuvarıdır.",
  "oppenheimer-trinity": "\n\n### Geleceğe Kalan Radyoaktif Miras\nManhattan Projesi'nin mirası sadece nükleer silahlar değil, aynı zamanda nükleer tıp ve enerji alanındaki büyük devrimlerdir. Radyoizotopların kullanımı, kanser tedavisinden arkeolojik yaş tayinine kadar pek çok alanda insanlığa hizmet etmiştir. Ancak bu 'parlak' mirasın yanında, nükleer atıkların yönetimi ve çevresel etkiler gibi çözülemeyen devasa sorunlar da kalmıştır. Oppenheimer'ın yarattığı bu 'ateş', insanlığın elindeki en büyük yapıcı ve yıkıcı güç olmaya devam etmektedir. Bu iki uçlu miras, modern bilimin trajik kahramanının insanlığa bıraktığı en büyük etik sınavdır. Los Alamos'un sessiz çöllerinde yankılanan o ilk patlama sesi, aslında her gün laboratuvarlarda sorulması gereken 'Nereye kadar?' sorusunun ebedi cevabıdır."
};

let cards = JSON.parse(fs.readFileSync(path, 'utf8'));
cards = cards.map(card => {
  if (extraParagraphs[card.id]) {
    card.realHistory += extraParagraphs[card.id];
  }
  return card;
});

fs.writeFileSync(path, JSON.stringify(cards, null, 2), 'utf8');
console.log('Final nudge applied. All 7 priority cards should now be over target.');
