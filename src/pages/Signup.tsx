import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signup } from '../api/auth';
import type { User } from '../types/user';

interface SignupProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const passwordRules = [
  { label: '8자리 이상 (필수)', test: (pw: string) => pw.length >= 8 },
  { label: '숫자 포함', test: (pw: string) => /\d/.test(pw) },
  {
    label: '영문 대소문자 포함',
    test: (pw: string) => /[a-z]/.test(pw) && /[A-Z]/.test(pw),
  },
  {
    label: '특수문자 포함',
    test: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
  },
  {
    label: '연속된 문자열이나 숫자 없음',
    test: (pw: string) =>
      !/(012|123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(
        pw
      ),
  },
];

const Signup: React.FC<SignupProps> = ({ setUser, setToken }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert('비밀번호가 일치하지 않습니다!');
      return;
    }

    try {
      const data = await signup({
        authType: 'APPLICANT',
        info: {
          type: 'APPLICANT',
          name: name.trim(),
          email: `${email.trim()}@snu.ac.kr`,
          password: password.trim(),
          successCode: 'STRING',
        },
      });

      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        window.location.href = '/';
      } else {
        alert('회원가입 실패! 서버 응답을 확인하세요.');
      }
    } catch (err) {
      console.error(err);
      alert('회원가입 중 오류가 발생했습니다!');
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

        <div className="password-wrapper">
          <input
            placeholder="비밀번호"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocused(true)}
            required
          />
          <span
            className="toggle-eye"
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        <div className="password-wrapper">
          <input
            placeholder="비밀번호 확인"
            type={showConfirm ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onFocus={() => setFocused(true)}
            required
          />
          <span
            className="toggle-eye"
            onClick={() => setShowConfirm((s) => !s)}
          >
            {showConfirm ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        {focused && (
          <ul className="password-guidelines">
            {passwordRules.map((rule, idx) => (
              <li key={idx} className={rule.test(password) ? 'met' : 'unmet'}>
                {rule.label}
              </li>
            ))}
          </ul>
        )}

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
