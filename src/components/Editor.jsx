import React, { useState, useEffect, useRef } from "react";
import VirtualKeyboard from "./VirtualKeyboard";
import { useTexts } from "../contexts/TextsContext";

export default function Editor() {
  const { texts, activeId, updateText, addText, setActiveId, removeText } = useTexts();
  const active = texts.find((t) => t.id === activeId);
  const displayRef = useRef(null);
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);
  const [currentFileName, setCurrentFileName] = useState(null);

  useEffect(() => {
    if (active) {
      if (displayRef.current) {
        displayRef.current.innerHTML = active.content || "";
        applyStyles(active.styles || {});
      }
      setText(active.content || "");
      setHistory([]);
    }
  }, [activeId, active]);

  const applyStyles = (styles) => {
    if (!displayRef.current) return;
    Object.entries(styles).forEach(([key, value]) => {
      displayRef.current.style[key] = value;
    });
  };

  const saveContent = () => {
    if (!displayRef.current || !active) return;
    const content = displayRef.current.innerHTML;
    setText(content);
    updateText(activeId, { ...active, content });
  };

  const saveCurrentToHistory = () => {
    if (!displayRef.current) return;
    const content = displayRef.current.innerHTML;
    setHistory((prev) => [content, ...prev.slice(0, 9)]);
  };

  const saveToHistoryManually = () => {
    saveCurrentToHistory();
    alert("הטקסט נשמר להיסטוריה!");
  };

  const handleKeyboardInput = (button) => {
    if (!displayRef.current) return;
    saveCurrentToHistory();

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

    while (index > 0 && text[index - 1] === " ") index--;
    while (index > 0 && text[index - 1] !== " ") index--;

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
      saveCurrentToHistory();
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
      saveContent();
    }
    setHistory(rest);
  };

  const saveToLocalStorage = () => {
    if (!displayRef.current) return;
    const fileName = prompt("הזן שם לקובץ לשמירה:");
    if (fileName) {
      const content = displayRef.current.innerHTML;
      localStorage.setItem(`textEditor_${fileName}`, content);
      setCurrentFileName(fileName);
      alert(`הטקסט נשמר בהצלחה בשם "${fileName}"!`);
    }
  };

  const loadFromLocalStorage = () => {
    const fileName = prompt("הזן את שם הקובץ שברצונך לפתוח:");
    if (fileName) {
      const content = localStorage.getItem(`textEditor_${fileName}`);
      if (content && displayRef.current) {
        displayRef.current.innerHTML = content;
        saveContent();
        setCurrentFileName(fileName);
        alert("הטקסט נטען בהצלחה!");
      } else {
        alert(`לא נמצא קובץ בשם "${fileName}"`);
      }
    }
  };

  const saveCurrentFile = () => {
    if (!currentFileName) {
      alert("אין קובץ פתוח. השתמש ב-'שמור בשם'.");
      return;
    }
    const content = displayRef.current.innerHTML;
    localStorage.setItem(`textEditor_${currentFileName}`, content);
    alert(`הקובץ "${currentFileName}" נשמר!`);
  };

  const handleAddNewText = () => {
    const newId = addText("טקסט חדש");
    setActiveId(newId);
  };

  const handleCloseText = (id) => {
    if (window.confirm("האם לשמור לפני סגירה?")) {
      const text = texts.find((t) => t.id === id);
      if (text) {
        localStorage.setItem(`textEditor_${text.title}_${id}`, text.content);
      }
    }
    removeText(id);
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
          <button onClick={saveCurrentFile}>💾 שמור</button>
          <button onClick={saveToLocalStorage}>💾 שמור בשם</button>
          <button onClick={loadFromLocalStorage}>📂 פתח קובץ</button>
        </div>
      </div>
    </div>
  );
}

    
