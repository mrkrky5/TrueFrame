"use client";

import React, { createContext, useContext } from "react";

const DictionaryContext = createContext<any>(null);

export function DictionaryProvider({ 
  dictionary, 
  children 
}: { 
  dictionary: any; 
  children: React.ReactNode 
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const dictionary = useContext(DictionaryContext);
  if (!dictionary) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return dictionary;
}
