import React, { createContext, useState, useContext, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    // try load from localStorage for persistence
    try {
      const stored = localStorage.getItem('wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const addItem = course => {
    setItems(prev => {
      if (prev.find(c => c.id === course.id)) return prev;
      return [...prev, course];
    });
  };

  const removeItem = courseId => {
    setItems(prev => prev.filter(c => c.id !== courseId));
  };

  const toggleItem = course => {
    if (items.find(c => c.id === course.id)) {
      removeItem(course.id);
    } else {
      addItem(course);
    }
  };

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, toggleItem }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
