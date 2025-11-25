import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { getMe, logout } from './api/auth';
import MyPage from "./components/MyPage";
import Navbar from './components/Navbar';
import ProfileForm from "./components/ProfileForm";
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import type { User } from './types/user';
import './css/styles.css';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  useEffect(() => {
    if (token) {
      getMe(token).then((data) => {
        if (data.name) setUser(data);
      });
    }
  }, [token]);

  const handleLogout = async () => {
    if (token) await logout(token);
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={<Login setUser={setUser} setToken={setToken} />}
        />
        <Route
          path="/signup"
          element={<Signup setUser={setUser} setToken={setToken} />}
        />
        <Route path="/mypage" element={token ? <MyPage token={token} /> : <LandingPage />} />
        <Route path="/mypage/profile" element={token ? <ProfileForm token={token} /> : <LandingPage />} />

      </Routes>
    </Router>
  );
};

export default App;
