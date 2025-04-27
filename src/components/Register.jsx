import React, { useState } from "react";
import MessageBox from "./MessageBox";
import Login from "./Login";

export default function Register({ onComplete }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) return <Login />;

  const handleRegister = () => {
    if (!username || !password) {
      setMessage("נא למלא את כל השדות");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
      setMessage("משתמש כבר קיים");
    } else {
      users[username] = { password };
      localStorage.setItem("users", JSON.stringify(users));
      setMessage("נרשמת בהצלחה!");
      if (onComplete) onComplete(username);
    }
  };

  return (
    <div className="form-container">
      <h2>הרשמה</h2>
      <input
        type="text"
        placeholder="שם משתמש"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="סיסמה"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>צור חשבון</button>
      <p>יש לך חשבון? <span className="link" onClick={() => setShowLogin(true)}>חזור להתחברות</span></p>
      {message && <MessageBox message={message} />}
    </div>
  );
}
