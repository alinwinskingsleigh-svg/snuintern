import axios from "axios";
import { axiosInstance } from "./axiosInstance";


const API_BASE = "/api/applicant";

export const getMyProfile = async (token: string) => {
  try {
    const res = await axios.get(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
    if (err.response?.data?.code === "APPLICANT_002") {
      return null;
    }
  }
    throw err;
  }
};

export const saveProfile = async (
  token: string,
  enrollYear: number,
  department: string,
  cvKey: string
) => {
  const res = await axios.put(
    `${API_BASE}/me`,
    { enrollYear, department, cvKey },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getMe = async (token: string) => {
  const res = await axiosInstance.get("/api/applicant/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const putMe = async (
  token: string,
  body: { enrollYear: number; department: string; cvKey: string }
) => {
  const res = await axiosInstance.put("/api/applicant/me", body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};