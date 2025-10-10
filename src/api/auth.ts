const BASE_URL = "https://api-internhasha.wafflestudio.com";

// src/api/auth.ts
export interface SignupRequest {
  authType: "APPLICANT";
  info: {
    type: "APPLICANT";
    name: string;
    email: string;
    password: string;
    successCode: string;
  };
}

export interface SignupResponse {
  token?: string;
  [key: string]: any; // 서버에서 추가로 반환하는 데이터가 있으면 대응
}

export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  try {
    const response = await fetch("${BASE_URL}/api/auth/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const text = await response.text();
    let json;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = {};
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Signup error:", errorData);
      return {}; // 실패 시 빈 객체 반환
    }

    return await response.json();
  } catch (err) {
    console.error("Signup fetch failed:", err);
    return {};
  }
};

export const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/api/auth/user/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};
