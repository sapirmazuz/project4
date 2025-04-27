import React, { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const TextsContext = createContext();

export function useTexts() {
  return useContext(TextsContext);
}

export function TextsProvider({ children }) {
  const [texts, setTexts] = useState([
    {
      id: uuidv4(),
      title: "טקסט ראשון",
      content: "",
      styles: {},
    }
  ]);

  const [activeId, setActiveId] = useState(texts[0].id);

  const updateText = (id, updated) => {
    setTexts((prev) =>
      prev.map((text) => (text.id === id ? { ...text, ...updated } : text))
    );
  };

  const addText = (initialContent = "") => {
    const newText = {
      id: uuidv4(),
      title: `טקסט ${texts.length + 1}`,
      content: initialContent,
      styles: {},
    };
    setTexts((prev) => [...prev, newText]);
    setActiveId(newText.id); // 🆕 מעביר מיד לאקטיבי
    return newText.id;
  };

  const removeText = (id) => {
    setTexts((prev) => {
      const updated = prev.filter((text) => text.id !== id);
      if (id === activeId) {
        if (updated.length > 0) {
          setActiveId(updated[0].id);
        } else {
          setActiveId(null);
        }
      }
      return updated;
    });
  };

  return (
    <TextsContext.Provider
      value={{ texts, activeId, updateText, addText, setActiveId, removeText }}
    >
      {children}
    </TextsContext.Provider>
  );
}
