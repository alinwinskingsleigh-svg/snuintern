const BASE_URL = 'https://api-internhasha.wafflestudio.com';

import type { User } from '../types/user';

export interface SignupRequest {
  authType: 'APPLICANT';
  info: {
    type: 'APPLICANT';
    name: string;
    email: string;
    password: string;
    successCode: string;
  };
}
// types.ts 또는 Signup.tsx 위쪽
export interface SignupInfo {
  type: 'APPLICANT';
  name: string;
  email: string;
  password: string;
  successCode: string;
}

export interface SignupData {
  authType: 'APPLICANT';
  info: SignupInfo;
}

export interface SignupResponse {
  user?: User;
  token?: string;
  [key: string]: unknown;
}

// signup 함수
export async function signup(data: SignupData) {
  const response = await fetch(
    'https://api-internhasha.wafflestudio.com/api/auth/user',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );

  // 성공 / 실패 모두 JSON으로 처리
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`Signup failed: ${response.status}`);
  }

  return result;
}

export const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/api/auth/user/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const getMe = async (token: string): Promise<User> => {
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const logout = async (token: string) => {
  await fetch(`${BASE_URL}/api/auth/user/session`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
};