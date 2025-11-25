import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../api/applicant';

interface ProfileData {
  name: string;
  email: string;
  enrollYear: number;
  department: string;
}

const ProfileTab: React.FC<{ token: string }> = ({ token }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMe(token)
      .then((data) => setProfile(data))
      .catch((err: unknown) => {
        const axiosErr = err as AxiosError<{ code: string }>;

        if (axiosErr.response?.data?.code === 'APPLICANT_002') setProfile(null);
        else console.error(err);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="profile-tab">
      {profile ? (
        <>
          <p>이름: {profile.name}</p>
          <p>이메일: {profile.email}</p>
          <p>학번: {profile.enrollYear}</p>
          <p>학과: {profile.department}</p>
          <button onClick={() => navigate('/mypage/profile')}>
            내 프로필 수정
          </button>
        </>
      ) : (
        <button onClick={() => navigate('/mypage/profile')}>
          내 프로필 생성
        </button>
      )}
    </div>
  );
};

export default ProfileTab;
