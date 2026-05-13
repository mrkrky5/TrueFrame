import React, { useState } from "react";
import { AccuracyType } from "@/types";
import { Check, HelpCircle, Info, Sparkles } from "lucide-react";
import { useDictionary } from "@/components/utils/DictionaryProvider";

interface Props {
  cardId: string;
  actualAccuracy: AccuracyType;
  onGuess: (guess: AccuracyType) => void;
  savedGuess?: AccuracyType;
  explanation?: string;
}

export default function AccuracyGuess({ cardId, actualAccuracy, onGuess, savedGuess, explanation }: Props) {
  const dictionary = useDictionary();
  const [selected, setSelected] = useState<AccuracyType | undefined>(savedGuess);

  const handleSelect = (guess: AccuracyType) => {
    if (selected) return;
    setSelected(guess);
    onGuess(guess);
  };

  const isCorrect = selected === actualAccuracy;

  const getOptionLabel = (val: AccuracyType) => dictionary.common.accuracyOptions[val] || val;

  return (
    <div className="bg-neutral-50 rounded-4xl p-7 border border-black/5 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-brand-secondary/10 rounded-xl flex items-center justify-center text-brand-secondary">
          <HelpCircle size={18} />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900">{dictionary.common.accuracyGuessTitle}</h3>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">{dictionary.common.accuracyGuessSubtitle}</p>
        </div>
      </div>

      {!selected ? (
        <div className="grid grid-cols-1 gap-2">
          {(Object.keys(dictionary.common.accuracyOptions) as AccuracyType[]).map((val) => (
            <button
              key={val}
              onClick={() => handleSelect(val)}
              className="w-full py-3 px-4 bg-white border border-black/5 rounded-xl text-[11px] font-bold text-neutral-600 uppercase tracking-wide active:scale-[0.98] transition-all hover:bg-neutral-50 hover:border-brand-secondary/20"
            >
              {dictionary.common.accuracyOptions[val]}
            </button>
          ))}
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in duration-500 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-black/5">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCorrect ? "bg-green-100 text-green-600" : "bg-brand-secondary/10 text-brand-secondary"}`}>
              {isCorrect ? <Check size={20} strokeWidth={3} /> : <Info size={20} />}
            </div>
            <div>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">
                {isCorrect ? dictionary.common.congrats : dictionary.common.actualRating}
              </p>
              <p className="text-sm font-bold text-neutral-900">
                {getOptionLabel(actualAccuracy)}
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-brand-secondary/5 rounded-2xl border border-brand-secondary/10 italic text-[13px] text-neutral-700 leading-relaxed">
            "{explanation || dictionary.common.accuracyFeedback[actualAccuracy]}"
          </div>
        </div>
      )}
    </div>
  );
}
