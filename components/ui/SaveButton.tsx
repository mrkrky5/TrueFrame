"use client";

import { useHistory } from "@/hooks/useHistory";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useDictionary } from "@/components/utils/DictionaryProvider";

interface Props {
  cardId: string;
}

const SaveButton = ({ cardId }: Props) => {
  const { isSaved, toggleSave } = useHistory();
  const dictionary = useDictionary();
  const saved = isSaved(cardId);

  return (
    <button
      onClick={() => toggleSave(cardId)}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm border ${
        saved 
        ? "bg-neutral-950 text-white border-neutral-950" 
        : "bg-white text-neutral-950 border-black/10"
      }`}
      aria-label={saved ? (dictionary.common.removeFromLibrary || "Remove from Library") : (dictionary.common.addToLibrary || "Add to Library")}
    >
      {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
    </button>
  );
};

export default SaveButton;
