import React from "react";
import { Lightbulb, Zap, Bookmark, Check } from "lucide-react";
import { useDictionary } from "@/components/utils/DictionaryProvider";

interface Props {
  cardId: string;
  selectedReflections: string[];
  onToggle: (reflection: string) => void;
}

const REFLECTIONS = [
  { id: "learned", icon: <Lightbulb size={14} /> },
  { id: "surprised", icon: <Zap size={14} /> },
  { id: "later", icon: <Bookmark size={14} /> }
];

export default function ReadReflection({ cardId, selectedReflections, onToggle }: Props) {
  const dictionary = useDictionary();
  const labels = dictionary.common.reflectionLabels || {
    learned: "Learned this",
    surprised: "Surprised",
    later: "Will revisit"
  };

  return (
    <div className="flex flex-wrap gap-2">
      {REFLECTIONS.map((ref) => {
        const isSelected = selectedReflections.includes(ref.id);
        return (
          <button
            key={ref.id}
            onClick={() => onToggle(ref.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              isSelected 
                ? "bg-neutral-950 text-white border-neutral-950 shadow-lg" 
                : "bg-white text-neutral-500 border-black/5 active:bg-neutral-50"
            }`}
          >
            {isSelected ? <Check size={14} strokeWidth={3} /> : ref.icon}
            {labels[ref.id as keyof typeof labels]}
          </button>
        );
      })}
    </div>
  );
}
