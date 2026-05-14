import Link from "next/link";
import { Home, Compass, MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="w-24 h-24 bg-brand-secondary/10 rounded-4xl flex items-center justify-center text-brand-secondary mb-8 animate-pulse">
        <MapPinOff size={40} />
      </div>
      
      <h1 className="text-3xl font-serif text-neutral-950 mb-4 max-w-sm">
        This trail seems to be lost
      </h1>
      
      <p className="text-neutral-500 text-sm leading-relaxed max-w-xs mb-10">
        We couldn’t find this page. Return home or continue exploring in your preferred language.
      </p>
      
      <div className="grid grid-cols-1 gap-3 w-full max-w-[240px]">
        <Link 
          href="/tr"
          className="flex items-center justify-center gap-2 w-full py-4 bg-neutral-950 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-[0.95] transition-all shadow-xl"
        >
          <Home size={16} /> Ana Sayfa (TR)
        </Link>
        
        <Link 
          href="/en"
          className="flex items-center justify-center gap-2 w-full py-4 bg-white border border-black/5 text-neutral-900 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-[0.95] transition-all shadow-sm"
        >
          <Compass size={16} /> Home (EN)
        </Link>
      </div>
      
      <div className="mt-20 opacity-20 grayscale pointer-events-none">
        <h2 className="text-6xl font-serif font-black">404</h2>
      </div>
    </div>
  );
}
