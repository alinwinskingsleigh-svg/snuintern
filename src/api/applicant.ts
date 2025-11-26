import { axiosInstance } from './axiosInstance';

//const API_BASE = '/api/applicant';

export const getMe = async (token: string) => {
  const res = await axiosInstance.get('/api/applicant/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const putMe = async (
  token: string,
  body: { enrollYear: number; department: string; cvKey: string }
) => {
  const res = await axiosInstance.put('/api/applicant/me', body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
