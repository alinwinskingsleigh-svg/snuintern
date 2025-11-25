import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MyPage from '../components/MyPage.tsx';
import ProfileForm from '../components/ProfileForm';

const MyPagePage: React.FC<{ token: string }> = ({ token }) => (
  <Routes>
    <Route path="/" element={<MyPage token={token} />} />
    <Route path="profile-form" element={<ProfileForm token={token} />} />
  </Routes>
);

export default MyPagePage;
