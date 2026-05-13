"use client";

import { useState, useEffect, useCallback } from "react";

export const useHistory = () => {
  const [history, setHistory] = useState<{
    savedIds: string[];
    recentIds: string[];
    readIds: string[];
  }>({
    savedIds: [],
    recentIds: [],
    readIds: [],
  });

  const loadHistory = useCallback(() => {
    try {
      const saved = localStorage.getItem("saved_cards");
      const recent = localStorage.getItem("recent_cards");
      const read = localStorage.getItem("read_cards");
      
      setHistory({
        savedIds: saved ? JSON.parse(saved) : [],
        recentIds: recent ? JSON.parse(recent) : [],
        readIds: read ? JSON.parse(read) : [],
      });
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  useEffect(() => {
    loadHistory();
    
    // Listen for visibility changes to refresh state when returning to the tab
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadHistory();
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [loadHistory]);

  const toggleSave = useCallback((id: string) => {
    setHistory(prev => {
      const newSaved = prev.savedIds.includes(id)
        ? prev.savedIds.filter((i) => i !== id)
        : [...prev.savedIds, id];
      localStorage.setItem("saved_cards", JSON.stringify(newSaved));
      return { ...prev, savedIds: newSaved };
    });
  }, []);

  const addRecent = useCallback((id: string) => {
    setHistory(prev => {
      const newRecent = [id, ...prev.recentIds.filter((i) => i !== id)].slice(0, 10);
      localStorage.setItem("recent_cards", JSON.stringify(newRecent));
      return { ...prev, recentIds: newRecent };
    });
  }, []);

  const toggleRead = useCallback((id: string) => {
    setHistory(prev => {
      const newRead = prev.readIds.includes(id)
        ? prev.readIds.filter((i) => i !== id)
        : [...prev.readIds, id];
      localStorage.setItem("read_cards", JSON.stringify(newRead));
      return { ...prev, readIds: newRead };
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setHistory(prev => {
      if (prev.readIds.includes(id)) return prev;
      const newRead = [...prev.readIds, id];
      localStorage.setItem("read_cards", JSON.stringify(newRead));
      return { ...prev, readIds: newRead };
    });
  }, []);

  const isSaved = useCallback((id: string) => history.savedIds.includes(id), [history.savedIds]);
  const isRead = useCallback((id: string) => history.readIds.includes(id), [history.readIds]);

  return { 
    savedIds: history.savedIds, 
    recentIds: history.recentIds, 
    readIds: history.readIds, 
    toggleSave, 
    addRecent, 
    toggleRead, 
    markAsRead,
    isSaved, 
    isRead 
  };
};
