import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  user: { name: string } | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        스누인턴
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <button onClick={() => navigate("/mypage")}>마이페이지</button>
            <button onClick={onLogout}>로그아웃</button>
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
