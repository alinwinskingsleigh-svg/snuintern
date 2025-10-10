import React, { useState } from "react";
import { signup } from "../api/auth";

interface SignupProps {
  setUser: React.Dispatch<React.SetStateAction<any>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const Signup: React.FC<SignupProps> = ({ setUser, setToken }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }

    try {
      // 서버가 요구하는 JSON 구조에 맞게 호출
      const data = await signup({
        authType: "APPLICANT",
        info: {
          type: "APPLICANT",
          name,
          email: `${email}@snu.ac.kr`,
          password,
          successCode: "string",
        },
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser({ name });
        window.location.href = "/";
      } else {
        alert("회원가입 실패!");
      }
    } catch (err) {
      console.error(err);
      alert("회원가입 중 오류가 발생했습니다!");
    }
  };

  return (
    <div className="form-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          placeholder="비밀번호 확인"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <div className="email-field">
          <input
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <span>@snu.ac.kr</span>
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Signup;
