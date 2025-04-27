import React from "react";
import { useTexts } from "../contexts/TextsContext";

export default function Display() {
  const { texts, activeId } = useTexts();
  const active = texts.find((t) => t.id === activeId);
  if (!active) return null;

  return (
    <div className="display-area">
      <p style={active.styles}>{active.content}</p>
    </div>
  );
}