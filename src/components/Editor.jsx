import React, { useState, useEffect, useRef } from "react";
import VirtualKeyboard from "./VirtualKeyboard";
import { useTexts } from "../contexts/TextsContext";

export default function Editor() {
  const { texts, activeId, updateText } = useTexts();
  const active = texts.find((t) => t.id === activeId);
  const displayRef = useRef(null);
  const [text, setText] = useState(active?.content || "");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (active) {
      setText(active.content || "");
      if (displayRef.current) {
        displayRef.current.innerHTML = active.content || "";
        Object.entries(active.styles || {}).forEach(([key, value]) => {
          displayRef.current.style[key] = value;
        });
      }
      setHistory([]); // מאפס היסטוריה כאשר עוברים טאב
    }
  }, [activeId, active]);

  const saveContent = () => {
    if (!displayRef.current) return;
    const content = displayRef.current.innerHTML;
    setText(content);
    if (active) {
      updateText(activeId, { ...active, content });
    }
  };

  const saveCurrentToHistory = () => {
    if (!displayRef.current) return;
    const content = displayRef.current.innerHTML;
    setHistory((prev) => [content, ...prev.slice(0, 9)]); // שומר עד 10 גרסאות אחרונות
  };

  const saveToHistoryManually = () => {
    if (!displayRef.current) return;
    const content = displayRef.current.innerHTML;
    setHistory((prev) => [content, ...prev.slice(0, 9)]);
    alert("הטקסט נשמר להיסטוריה!");
  };

  const handleKeyboardInput = (button) => {
    if (!displayRef.current) return;

    saveCurrentToHistory(); // שמירה אוטומטית לפני כל פעולה

    if (button === "{bksp}") {
      document.execCommand("delete");
    } else if (button === "{space}") {
      document.execCommand("insertText", false, " ");
    } else if (button === "{delword}") {
      deleteLastWord();
    } else if (button === "{clear}") {
      clearContent();
    } else {
      document.execCommand("insertText", false, button);
    }

    saveContent();
  };

  const deleteLastWord = () => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    if (!range.collapsed) return;

    const { startContainer, startOffset } = range;
    if (startContainer.nodeType !== Node.TEXT_NODE) return;

    const text = startContainer.textContent;
    let index = startOffset;

    while (index > 0 && text[index - 1] === " ") {
      index--;
    }
    while (index > 0 && text[index - 1] !== " ") {
      index--;
    }

    const newText = text.slice(0, index) + text.slice(startOffset);
    startContainer.textContent = newText;

    const newRange = document.createRange();
    newRange.setStart(startContainer, index);
    newRange.setEnd(startContainer, index);

    sel.removeAllRanges();
    sel.addRange(newRange);

    saveContent();
  };

  const clearContent = () => {
    if (displayRef.current) {
      displayRef.current.innerHTML = "";
      saveContent();
    }
  };

  const findChar = () => {
    const char = prompt("הזן תו לחיפוש:");
    if (char && displayRef.current) {
      const content = displayRef.current.innerText;
      if (content.includes(char)) {
        alert(`התו "${char}" נמצא בטקסט!`);
      } else {
        alert(`התו "${char}" לא נמצא.`);
      }
    }
  };

  const replaceChar = () => {
    const findChar = prompt("איזה תו להחליף?");
    const replaceWith = prompt("במה להחליף?");
    if (findChar && replaceWith && displayRef.current) {
      saveCurrentToHistory(); // גם לפני החלפה
      const content = displayRef.current.innerHTML;
      const updated = content.split(findChar).join(replaceWith);
      displayRef.current.innerHTML = updated;
      saveContent();
    }
  };

  const showHistory = () => {
    if (history.length === 0) {
      alert("אין היסטוריית פעולות עדיין.");
    } else {
      const historyText = history.map((h, i) => `${i + 1}. ${h}`).join("\n\n");
      alert("פעולות אחרונות:\n\n" + historyText);
    }
  };

  const undoLastAction = () => {
    if (history.length === 0) {
      alert("אין פעולה לבטל.");
      return;
    }
    const [last, ...rest] = history;
    if (displayRef.current) {
      displayRef.current.innerHTML = last;
      setText(last);
      if (active) {
        updateText(activeId, { ...active, content: last });
      }
    }
    setHistory(rest);
  };

  return (
    <div className="editor-container">
      <div className="main-editor">
        <div
          className="display-area"
          contentEditable
          suppressContentEditableWarning
          ref={displayRef}
          onInput={saveContent}
        />
        <VirtualKeyboard onKeyPress={handleKeyboardInput} />
        <div className="extra-controls">
          <button onClick={findChar}>🔍 חיפוש תו</button>
          <button onClick={replaceChar}>🔁 החלפת תו</button>
          <button onClick={showHistory}>♻️ פעולות אחרונות</button>
          <button onClick={undoLastAction}>↩️ Undo</button>
          <button onClick={saveToHistoryManually}>💾 שמור להיסטוריה</button>
        </div>
      </div>
    </div>
  );
}
