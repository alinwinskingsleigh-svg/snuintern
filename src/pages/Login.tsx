import React, { useState } from "react";
import { getMe, login } from "../api/auth";

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<any>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const Login: React.FC<LoginProps> = ({ setUser, setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = await login(`${email}@snu.ac.kr`, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      const me = await getMe(data.token);
      setUser(me);
      window.location.href = "/";
    } else {
      alert("로그인 실패!");
    }
  };

  return (
    <div className="form-container">
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div className="email-field">
          <input
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <span>@snu.ac.kr</span>
        </div>
        <input
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default Login;
