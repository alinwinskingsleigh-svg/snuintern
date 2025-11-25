import { AxiosError } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../api/applicant';
import BookmarksTab from './BookmarksTab';
import ProfileTab from './ProfileTab';

// 스타일 파일 import
import '../css/MyPage.css';
import '../css/MyPagePostCard.css';

interface MyPageProps {
  token: string;
}

// 프로필 데이터 타입 정의
export interface ProfileData {
  name: string;
  email: string;
  enrollYear: number;
  department: string;
}

const MyPage: React.FC<MyPageProps> = ({ token }) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'profile'>(
    'bookmarks'
  );
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();

  // 프로필 데이터 가져오기 (상위 컴포넌트에서 관리)
  const fetchProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      const data = await getMe(token);
      setProfile(data);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ code: string }>;
      // APPLICANT_002: 프로필이 없는 경우
      if (axiosErr.response?.data?.code === 'APPLICANT_002') {
        setProfile(null);
      } else {
        console.error('Failed to fetch profile:', err);
      }
    } finally {
      setProfileLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleMoveToProfile = () => {
    navigate('/mypage/profile');
  };

  return (
    <div className="mypage">
      {/* 탭 버튼 영역 */}
      <div className="tabs" style={{ display: 'flex', alignItems: 'center' }}>
        <button
          className={`tab-button ${activeTab === 'bookmarks' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookmarks')}
        >
          관심 공고
        </button>
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          내 정보
        </button>

        {/* '내 정보' 탭일 때만 우측에 버튼 표시 */}
        {activeTab === 'profile' && !profileLoading && (
          <button
            className="btn-create-profile-small"
            onClick={handleMoveToProfile}
            style={{ marginLeft: 'auto' }} // 버튼을 오른쪽 끝으로 밀어줌
          >
            {profile ? '내 프로필 수정' : '내 프로필 생성'}
          </button>
        )}
      </div>

      {/* 탭 내용 영역 */}
      <div
        className={`tab-content ${activeTab === 'bookmarks' ? 'mypage-card-list' : ''}`}
      >
        {activeTab === 'bookmarks' ? (
          <BookmarksTab token={token} />
        ) : (
          <ProfileTab
            profile={profile}
            loading={profileLoading}
            onMoveToProfile={handleMoveToProfile}
          />
        )}
      </div>
    </div>
  );
};

export default MyPage;
