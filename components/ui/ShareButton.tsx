"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { useDictionary } from "@/components/utils/DictionaryProvider";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
}

export default function ShareButton({ title, text, url, className = "" }: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const dictionary = useDictionary();

  const handleShare = async () => {
    const shareUrl = url || typeof window !== 'undefined' ? window.location.href : "";
    const shareData = {
      title,
      text,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Paylaşım hatası:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Kopyalama hatası:", err);
      }
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleShare}
        className={`w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-black/5 flex items-center justify-center text-brand-secondary shadow-md active:scale-90 transition-all ${className}`}
        aria-label={dictionary.common.share || "Share"}
      >
        {isCopied ? <Check size={20} /> : <Share2 size={20} />}
      </button>

      {isCopied && (
        <div className="absolute top-14 right-0 bg-neutral-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-2 duration-300 z-100 whitespace-nowrap">
          {dictionary.common.linkCopied || "LINK COPIED"}
        </div>
      )}
    </div>
  );
}
