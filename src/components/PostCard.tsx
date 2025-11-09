// src/components/PostCard.tsx
import React, { useState } from 'react';
import type { Post } from '../types/post';
import { bookmarkPost, unbookmarkPost } from '../api/post_api';
import '../css/PostCard.css';
import { DOMAINS } from '../constants/post';
// TODO: 로그인 상태를 확인하는 훅 (예: useAuth)이 있다고 가정합니다.
// const useAuth = () => ({ isAuthenticated: !!localStorage.getItem('token') });

interface PostCardProps {
  post: Post;
  // 찜하기 버튼 클릭 시 로그인 필요 알림을 외부에 전달하는 핸들러
  onLoginRequired: () => void; 
  // 찜하기 성공/실패 후 목록을 새로고침할 필요가 있음을 외부에 알리는 핸들러
  refreshPosts: () => void; 
}

const PostCard = ({ post, onLoginRequired, refreshPosts }: PostCardProps) => {
  // Post 객체의 isBookmarked 상태를 따라가지만, Optimistic UI를 위해 로컬 상태도 사용
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  // const { isAuthenticated } = useAuth(); // TODO: 실제 인증 훅 사용

  // 임시: localStorage에 token이 있으면 로그인된 것으로 간주 (usePosts.js 참고)
  const isAuthenticated = !!localStorage.getItem('token'); 

  // 찜하기 핸들러
  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      // 스펙: 로그인하지 않았다면 찜하기 버튼 클릭 시 로그인 유도 모달이 나타나도록
      onLoginRequired();
      return;
    }
    
    // Optimistic UI 업데이트: 로컬 상태 먼저 변경
    const newBookmarkStatus = !isBookmarked;
    setIsBookmarked(newBookmarkStatus);

    try {
      if (newBookmarkStatus) {
        // 찜하기: POST api/post/{post_id}/bookmark
        await bookmarkPost(post.id);
      } else {
        // 찜하기 해제: DELETE api/post/{post_id}/bookmark
        await unbookmarkPost(post.id);
      }
      
      // 성공 후 목록 새로고침 (데이터 refetch)
      refreshPosts();

    } catch (error) {
      console.error(`Failed to toggle bookmark status for post ${post.id}`, error);
      // 실패 시 원래 상태로 롤백
      setIsBookmarked(!newBookmarkStatus);
      alert('찜하기/해제에 실패했습니다. 다시 시도해주세요.');
      refreshPosts(); // 강제 새로고침 (안정성)
    }
  };

  // 마감일 D-Day 계산
  const endDate = new Date(post.employmentEndDate);
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const dDay = diffDays > 0 ? `D-${diffDays}` : '마감';

  const domainLabel = DOMAINS.find(d => d.value === post.domain)?.label || post.domain;

  return (
    <div className="post-card">
      <div className="post-card__header">
        {/* 스펙: 회사 로고 블럭 처리 */}
        <div className="post-card__logo">{/* 로고 블럭 */}</div>

        {/* 북마크 버튼 */}
        <button
          onClick={handleBookmarkToggle}
          className={`post-card__bookmark-button ${
            isBookmarked ? 'post-card__bookmark-button--bookmarked' : ''
          }`}
        >
          {/* 별 아이콘은 이제 PostCard.css에서 ::before 가상 요소를 통해 렌더링됩니다. */}
        </button>
      </div>

      <h3 className="post-card__title">{post.positionTitle}</h3>
      <div className="post-card__domain">{domainLabel}</div>
      <p className="post-card__company-name">{post.companyName}</p>
      <p className="post-card__d-day">마감까지 {dDay}</p>
      <p className="post-card__slogan">{post.slogan}</p>
    </div>
  );
};

export default PostCard;