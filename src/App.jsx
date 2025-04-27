// App.jsx
import React, { useEffect } from "react";
import { UserProvider, useUser } from "./contexts/UserContext";
import { TextsProvider, useTexts } from "./contexts/TextsContext";
import UserMenu from "./components/UserMenu";
import FileMenu from "./components/FileMenu";
import Editor from "./components/Editor";
import Display from "./components/Display";
import Toolbar from "./components/Toolbar";
import Login from "./components/Login";

function InnerApp() {
  const { user } = useUser();
  const { texts, activeId, addText, setActiveId } = useTexts();

  useEffect(() => {
    if (texts.length === 0) {
      const newId = addText("טקסט ראשון");
      setActiveId(newId);
    }
  }, [texts]);

  if (!user) return <Login />;

  return (
    <div className="app-container">
      <UserMenu />
      {/* <FileMenu /> */}
      <Toolbar />
      {/* <Display /> */}
      <Editor />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <TextsProvider>
        <InnerApp />
      </TextsProvider>
    </UserProvider>
  );
} 
