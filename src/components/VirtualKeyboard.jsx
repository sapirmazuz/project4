import React, { useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const layouts = {
  he: [
    "ק ו ר ט ו ן ם פ",
    "א ש ד ג כ ע י ח ל ך",
    "ז ס ב ה נ מ צ ת ץ",
    "{space} {bksp} {delword} {clear}"
  ],
  en: [
    "q w e r t y u i o p",
    "a s d f g h j k l",
    "z x c v b n m",
    "{space} {bksp} {delword} {clear}"
  ],
  emoji: [
    "😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇",
    "🥰 😍 🤩 😘 😗 😚 😙 🥲 😋 😛",
    "😝 😜 🤪 🤨 🧐 🤓 😎 🥸 😏 😒",
    "{space} {bksp} {delword} {clear}"
  ]
};

export default function VirtualKeyboard({ onKeyPress }) {
  const [layout, setLayout] = useState("he");

  const handleKeyPress = (button) => {
    if (onKeyPress) {
      onKeyPress(button);
    }
  };

  return (
    <div className="keyboard-container">
      <div className="keyboard-controls">
        <button onClick={() => setLayout("he")}>עברית</button>
        <button onClick={() => setLayout("en")}>English</button>
        <button onClick={() => setLayout("emoji")}>😀</button>
      </div>
      <Keyboard
        onKeyPress={handleKeyPress}
        layout={{ default: layouts[layout] }}
        display={{
          "{space}": "רווח",
          "{bksp}": "⌫ מחק תו",
          "{delword}": "⌦ מחק מילה",
          "{clear}": "🗑️ נקה הכל"
        }}
      />
    </div>
  );
}

    
