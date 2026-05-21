"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface LikesContextType {
  likedIds: string[];
  toggleLike: (productId: string) => void;
  isLiked: (productId: string) => boolean;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

export function LikesProvider({ children }: { children: React.ReactNode }) {
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedLikes = localStorage.getItem("zerothi_likes");
    if (savedLikes) {
      try {
        setLikedIds(JSON.parse(savedLikes));
      } catch (e) {
        console.error("Failed parsing likes from localstorage");
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage when changed
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("zerothi_likes", JSON.stringify(likedIds));
    }
  }, [likedIds, isLoaded]);

  const toggleLike = (productId: string) => {
    setLikedIds((prevIds) => {
      if (prevIds.includes(productId)) {
        return prevIds.filter((id) => id !== productId);
      }
      return [...prevIds, productId];
    });
  };

  const isLiked = (productId: string) => likedIds.includes(productId);

  return (
    <LikesContext.Provider value={{ likedIds, toggleLike, isLiked }}>
      {children}
    </LikesContext.Provider>
  );
}

export function useLikes() {
  const context = useContext(LikesContext);
  if (!context) {
    throw new Error("useLikes must be used within a LikesProvider");
  }
  return context;
}
