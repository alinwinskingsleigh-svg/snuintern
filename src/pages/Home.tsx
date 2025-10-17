import React from "react";
import "../styles.css";

interface HomeProps {
  user: { name: string } | null;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  return (
    <div className="home">
      <div className="center-box">
        {user ? (
          <h2>안녕하세요, {user.name}님 👋</h2>
        ) : (
          <h2>로그인 후 이용해주세요.</h2>
        )}
      </div>
    </div>
  );
};

export default Home;