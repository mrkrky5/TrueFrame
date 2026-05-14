import { Locale } from "@/lib/i18n-config";

export default function EnglishPilotBanner({ locale }: { locale: Locale }) {
  if (locale !== 'en') return null;

  return (
    <div role="note" className="mb-8 p-4 rounded-3xl bg-brand-secondary/10 border border-brand-secondary/20">
      <p className="text-[11px] font-bold text-brand-secondary uppercase tracking-widest mb-1">English Pilot Mode</p>
      <p className="text-xs text-neutral-600 leading-relaxed font-medium">
        Welcome! The English version is currently in preview with a selected story library. We are translating more soon!
      </p>
    </div>
  );
}
