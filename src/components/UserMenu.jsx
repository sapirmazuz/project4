import React from "react";
import { useUser } from "../contexts/UserContext";

export default function UserMenu() {
  const { user, login, logout } = useUser();
  const handleLogin = () => {
    const name = prompt("הכנס שם משתמש:");
    if (name) login(name);
  };

  return (
    <div className="user-menu">
      {user ? (
        <>
          <span>משתמש: {user}</span>
          <button onClick={logout}>התנתק</button>
        </>
      ) : (
        <button onClick={handleLogin}>התחבר</button>
      )}
    </div>
  );
}
