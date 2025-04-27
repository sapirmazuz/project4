import React, { useState } from "react";
import { useTexts } from "../contexts/TextsContext";
import { useUser } from "../contexts/UserContext";
import MessageBox from "./MessageBox";

export default function FileMenu() {
  const { addText, texts, activeId, setActiveId, removeText } = useTexts();
  const { user } = useUser();
  const [message, setMessage] = useState("");

  const save = () => {
    const active = texts.find((t) => t.id === activeId);
    if (active && user) {
      localStorage.setItem(`${user}-${active.title}`, JSON.stringify(active));
      setMessage("נשמר בהצלחה!");
    }
  };

  const open = () => {
    const name = prompt("שם הקובץ לפתיחה:");
    if (name && user) {
      const loaded = localStorage.getItem(`${user}-${name}`);
      if (loaded) {
        const parsed = JSON.parse(loaded);
        addText(parsed.title);
        setActiveId(parsed.id);
        setMessage("הקובץ נפתח בהצלחה");
      } else {
        setMessage("לא נמצא קובץ בשם הזה");
      }
    }
  };

  const close = () => {
    removeText(activeId);
    setMessage("הטקסט נסגר");
  };

  return (
    <div className="file-menu">
      {/* <button onClick={() => { addText("טקסט חדש"); setMessage("נוצר "); }}>חדש</button> */}
      <button onClick={save}>חדש</button>
      <button onClick={save}>שמור</button>
      <button onClick={open}>פתח</button>
      {/* <button onClick={close}>סגור</button> */}
      {message && <MessageBox message={message} />}
    </div>
  );
}