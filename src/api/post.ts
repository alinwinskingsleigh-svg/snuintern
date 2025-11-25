import { axiosInstance } from './axiosInstance';

export const getBookmarks = async (token: string) => {
  const res = await axiosInstance.get('/api/post/bookmarks', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.posts;
};
