import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = dictionary.legal;

  return (
    <div className="px-6 pt-safe max-w-lg mx-auto pb-20">
      <header className="mb-10 mt-10">
        <Link href={`/${lang}/saved`} className="inline-flex items-center gap-2 text-neutral-400 mb-6 text-xs font-bold uppercase tracking-widest active:scale-95 transition-all">
          <ArrowLeft size={14} /> {dictionary.common.back}
        </Link>
        <div className="flex items-center gap-3 text-brand-secondary mb-3">
          <Shield size={24} />
          <h1 className="text-3xl font-serif text-neutral-950">{t.privacy}</h1>
        </div>
      </header>

      <article className="prose prose-neutral font-serif text-lg leading-relaxed text-neutral-800 space-y-6">
        <p className="font-bold text-neutral-950 italic">
          {t.localStorageInfo}
        </p>
        
        {lang === 'tr' ? (
          <>
            <p>Medyadan Gerçeğe, kullanıcı gizliliğini temel alan bir deneyim sunar. Uygulama şu anda bir hesap sistemi kullanmamaktadır.</p>
            <h2 className="text-xl font-bold text-neutral-950 font-sans uppercase tracking-widest pt-4">1. Veri Saklama</h2>
            <p>Okuma ilerlemeniz, kütüphanenize eklediğiniz içerikler ve tamamladığınız yolculuklar sadece tarayıcınızın yerel depolama alanında (localStorage) saklanır. Bu veriler sunucularımıza iletilmez.</p>
            <h2 className="text-xl font-bold text-neutral-950 font-sans uppercase tracking-widest pt-4">2. İletişim</h2>
            <p>Geri bildirim butonu üzerinden gönderdiğiniz e-postalar veya formlar, sadece size yanıt vermek ve uygulamayı geliştirmek amacıyla kullanılır.</p>
            <h2 className="text-xl font-bold text-neutral-950 font-sans uppercase tracking-widest pt-4">3. Dış Bağlantılar</h2>
            <p>Uygulama içerisinde yer alan kaynakça linkleri dış web sitelerine yönlendirebilir. Bu sitelerin gizlilik politikalarından Medyadan Gerçeğe sorumlu değildir.</p>
          </>
        ) : (
          <>
            <p>Medyadan Gerçeğe (Media to Reality) provides a privacy-first experience. The app currently does not use an account system.</p>
            <h2 className="text-xl font-bold text-neutral-950 font-sans uppercase tracking-widest pt-4">1. Data Storage</h2>
            <p>Your reading progress, saved items, and completed journeys are stored only in your browser's local storage (localStorage). This data is not transmitted to our servers.</p>
            <h2 className="text-xl font-bold text-neutral-950 font-sans uppercase tracking-widest pt-4">2. Communication</h2>
            <p>Any emails or forms submitted via the feedback mechanism are used solely to respond to you and improve the application.</p>
            <h2 className="text-xl font-bold text-neutral-950 font-sans uppercase tracking-widest pt-4">3. External Links</h2>
            <p>Source links within the app may direct you to external websites. Medyadan Gerçeğe is not responsible for the privacy practices of those sites.</p>
          </>
        )}
      </article>
    </div>
  );
}
