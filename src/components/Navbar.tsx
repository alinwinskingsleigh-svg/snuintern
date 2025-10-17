import React from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  user: { name: string } | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">스누인턴</Link>
      <div className="nav-links">
        {user ? (
          <>
            <span className="user-name-text">{user.name}님</span> {/* 👈 클래스 추가 */}
            <button onClick={onLogout} className="logout-button">로그아웃</button> {/* 👈 클래스 추가 */}
          </>
        ) : (
          <>
            <Link to="/signup">회원가입</Link>
            <Link to="/login">로그인</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
