import React from "react";
import { useTexts } from "../contexts/TextsContext";

export default function Tabs() {
  const { texts, activeId, setActiveId } = useTexts();

  return (
    <div className="tabs">
      {texts.map((t) => (
        <button
          key={t.id}
          onClick={() => setActiveId(t.id)}
          className={activeId === t.id ? "active" : ""}
        >
          {t.title}
        </button>
      ))}
    </div>
  );
}
