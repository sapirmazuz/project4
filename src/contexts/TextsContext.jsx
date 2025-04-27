import React, { createContext, useState, useContext } from "react";

const TextsContext = createContext();

export function TextsProvider({ children }) {
  const [texts, setTexts] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [savedStyle, setSavedStyle] = useState(null);

  const addText = (title = "Untitled") => {
    const id = Date.now().toString();
    const newText = { id, title, content: "", styles: {} };
    setTexts((prev) => [...prev, newText]);
    setActiveId(id);
  };

  const updateText = (id, newContent) => {
    setTexts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, content: newContent } : t))
    );
  };

  const removeText = (id) => {
    setTexts((prev) => prev.filter((t) => t.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const value = {
    texts,
    activeId,
    setActiveId,
    addText,
    updateText,
    removeText,
    savedStyle,
    setSavedStyle,
  };

  return <TextsContext.Provider value={value}>{children}</TextsContext.Provider>;
}

export const useTexts = () => useContext(TextsContext);
