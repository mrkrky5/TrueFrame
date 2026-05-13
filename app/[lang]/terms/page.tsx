import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";
import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
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
          <Scale size={24} />
          <h1 className="text-3xl font-serif text-neutral-950">{t.terms}</h1>
        </div>
      </header>

      <article className="prose prose-neutral font-serif text-lg leading-relaxed text-neutral-800 space-y-6">
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900 text-sm font-sans mb-8">
          {lang === 'tr' ? 'Bu uygulama şu anda beta aşamasındadır.' : 'This application is currently in beta.'}
        </div>

        {lang === 'tr' ? (
          <>
            <h2 className="text-xl font-bold text-neutral-950 font-sans uppercase tracking-widest pt-4">1. İçerik ve Amaç</h2>
            <p>Medyadan Gerçeğe, popüler kültür eserleri ile tarihi gerçekler arasındaki bağlantıları inceleyen eğitimsel bir platformdur. Sunulan bilgiler güvenilir kaynaklara dayanmaktadır ancak akademik bir referans olarak kullanılmamalıdır.</p>
            <h2 className="text-xl font-bold text-neutral-950 font-sans uppercase tracking-widest pt-4">2. Kullanım Koşulları</h2>
            <p>Uygulama içeriğini kişisel ve ticari olmayan amaçlarla kullanabilirsiniz. İçeriğin kopyalanması veya başka platformlarda izinsiz paylaşılması yasaktır.</p>
            <h2 className="text-xl font-bold text-neutral-950 font-sans uppercase tracking-widest pt-4">3. Sorumluluk Reddi</h2>
            <p>Uygulama "olduğu gibi" sunulmaktadır. Beta aşamasında olduğu için teknik aksaklıklar veya içerik güncellemeleri yaşanabilir.</p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-neutral-950 font-sans uppercase tracking-widest pt-4">1. Content and Purpose</h2>
            <p>Medyadan Gerçeğe is an educational platform exploring connections between popular culture and historical facts. Information provided is based on reliable sources but should not be used as an academic reference.</p>
            <h2 className="text-xl font-bold text-neutral-950 font-sans uppercase tracking-widest pt-4">2. Usage Terms</h2>
            <p>You may use the app content for personal, non-commercial purposes. Copying or unauthorized sharing of content on other platforms is prohibited.</p>
            <h2 className="text-xl font-bold text-neutral-950 font-sans uppercase tracking-widest pt-4">3. Disclaimer</h2>
            <p>The app is provided "as is". As it is in beta, technical issues or content updates may occur.</p>
          </>
        )}
      </article>
    </div>
  );
}
