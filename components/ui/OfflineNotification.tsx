"use client";

import React, { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";
import { useDictionary } from "@/components/utils/DictionaryProvider";

export default function OfflineNotification() {
  const [isOffline, setIsOffline] = useState(false);
  const dictionary = useDictionary();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    if (!navigator.onLine) {
      setIsOffline(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-neutral-900/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
        <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 shrink-0">
          <WifiOff size={20} />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white">
            {dictionary.offline?.title || "No Connection"}
          </h4>
          <p className="text-[10px] text-neutral-400 font-medium leading-tight mt-0.5">
            {dictionary.offline?.message || "You are in offline mode. Some content may not load."}
          </p>
        </div>
      </div>
    </div>
  );
}
