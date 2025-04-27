import React from "react";
import { FaBold, FaItalic, FaUnderline, FaAlignRight, FaAlignCenter, FaAlignLeft } from "react-icons/fa";

export default function Toolbar() {

  const applyCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <label>גופן:</label>
        <select onChange={(e) => applyCommand("fontName", e.target.value)}>
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier</option>
          <option value="David">David</option>
        </select>
      </div>

      <div className="toolbar-group">
        <label>גודל:</label>
        <select onChange={(e) => applyCommand("fontSize", e.target.value)}>
          <option value="1">קטן</option>
          <option value="3">בינוני</option>
          <option value="5">גדול</option>
        </select>
      </div>

      <div className="toolbar-group">
        <label>צבע:</label>
        <input type="color" onChange={(e) => applyCommand("foreColor", e.target.value)} />
      </div>

      <div className="toolbar-group formatting-buttons">
        <button onClick={() => applyCommand("bold")}><FaBold /></button>
        <button onClick={() => applyCommand("italic")}><FaItalic /></button>
        <button onClick={() => applyCommand("underline")}><FaUnderline /></button>
      </div>

      <div className="toolbar-group formatting-buttons">
        <button onClick={() => applyCommand("justifyRight")}><FaAlignRight /></button>
        <button onClick={() => applyCommand("justifyCenter")}><FaAlignCenter /></button>
        <button onClick={() => applyCommand("justifyLeft")}><FaAlignLeft /></button>
      </div>
    </div>
  );
}
