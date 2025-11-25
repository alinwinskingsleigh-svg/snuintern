// src/components/MyPage.tsx
import React, { useState } from 'react';
import BookmarksTab from './BookmarksTab';
import ProfileTab from './ProfileTab';

import '../css/MyPage.css'; // 탭 스타일
import '../css/MyPagePostCard.css'; // 카드 그리드 스타일

const MyPage: React.FC<{ token: string }> = ({ token }) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'profile'>(
    'bookmarks'
  );

  return (
    <div className="mypage">
      {/* 탭 버튼 영역 */}
      <div className="tabs">
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
      </div>

      {/* 탭 내용 영역 */}
      <div
        className={`tab-content ${activeTab === 'bookmarks' ? 'mypage-card-list' : ''}`}
      >
        {activeTab === 'bookmarks' ? (
          <BookmarksTab token={token} />
        ) : (
          <ProfileTab token={token} />
        )}
      </div>
    </div>
  );
};

export default MyPage;
