import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import MessageBox from "./MessageBox";
import Register from "./Register";

export default function Login() {
  const { login } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) return <Register onComplete={(user) => {
    setUsername(user);
    setShowRegister(false);
  }} />;

  const handleSubmit = () => {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username] && users[username].password === password) {
      login(username);
    } else {
      setMessage("שם משתמש או סיסמה שגויים");
    }
  };

  return (
    <div className="form-container">
      <h2>התחברות</h2>
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
      <button onClick={handleSubmit}>התחבר</button>
      <p>אין לך חשבון? <span className="link" onClick={() => setShowRegister(true)}>עבור ל-Register</span></p>
      {message && <MessageBox message={message} />}
    </div>
  );
}
