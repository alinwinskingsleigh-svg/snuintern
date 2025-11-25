import React from 'react';
import '../css/MyPage.css'; // 스타일 import
import { type ProfileData } from './MyPage'; // MyPage에서 정의한 타입 import (또는 인터페이스 재선언)

interface ProfileTabProps {
  profile: ProfileData | null;
  loading: boolean;
  onMoveToProfile: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  loading,
  onMoveToProfile,
}) => {
  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="profile-tab">
      {!profile ? (
        /* --- 프로필이 없을 때 UI --- */
        <div className="profile-empty-content">
          <p>
            등록된 프로필이 없습니다.
            <br />
            프로필을 작성하고 맞춤형 공고를 추천받아보세요!
          </p>
          {/* 중앙 '지금 바로 프로필 작성하기' 버튼은 유지 */}
          <button
            className="btn-create-profile-large"
            onClick={onMoveToProfile}
          >
            지금 바로 프로필 작성하기
          </button>
        </div>
      ) : (
        /* --- 프로필이 있을 때 UI --- */
        <div className="profile-details">
          {/* 상단 헤더(제목, 수정 버튼) 삭제됨 -> MyPage 탭 바로 이동 */}

          <div className="profile-item">
            <span className="label">이름</span>
            <span className="value">{profile.name}</span>
          </div>
          <div className="profile-item">
            <span className="label">이메일</span>
            <span className="value">{profile.email}</span>
          </div>
          <div className="profile-item">
            <span className="label">학번</span>
            <span className="value">{profile.enrollYear}</span>
          </div>
          <div className="profile-item">
            <span className="label">학과</span>
            <span className="value">{profile.department}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
