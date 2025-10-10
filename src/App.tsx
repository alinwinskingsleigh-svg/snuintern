import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { getMe, logout } from "./api/auth";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./styles.css";

interface User {
  name: string;
  email: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      getMe(token).then((data) => {
        if (data.name) setUser(data);
      });
    }
  }, [token]);

  const handleLogout = async () => {
    if (token) await logout(token);
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} setToken={setToken} />} />
        <Route path="/signup" element={<Signup setUser={setUser} setToken={setToken} />} />
      </Routes>
    </Router>
  );
};

export default App;
