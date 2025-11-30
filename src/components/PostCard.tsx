import { useState } from 'react';
import { bookmarkPost, unbookmarkPost } from '../api/post_api';
import type { Post } from '../types/post';
import '../css/PostCard.css';
import { DOMAINS } from '../constants/post';

interface PostCardProps {
  post: Post;
  onLoginRequired: () => void;
  refreshPosts: () => void;
}

const PostCard = ({ post, onLoginRequired, refreshPosts }: PostCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const isAuthenticated = !!localStorage.getItem('token');

  // 찜하기 핸들러
  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }

    const newBookmarkStatus = !isBookmarked;
    setIsBookmarked(newBookmarkStatus);

    try {
      if (newBookmarkStatus) {
        await bookmarkPost(post.id);
      } else {
        await unbookmarkPost(post.id);
      }
      refreshPosts();
    } catch (error) {
      console.error(
        `Failed to toggle bookmark status for post ${post.id}`,
        error
      );
      setIsBookmarked(!newBookmarkStatus);
      alert('찜하기/해제에 실패했습니다. 다시 시도해주세요.');
      refreshPosts();
    }
  };

  // ✅ [수정] D-Day 계산 로직 (상시모집 처리 추가)
  const calculateDday = () => {
    // 1. 문자열 '상시모집', 'ALWAYS' 등 체크
    if (
      post.employmentEndDate === '상시모집' ||
      post.employmentEndDate === '상시' ||
      post.employmentEndDate === 'ALWAYS'
    ) {
      return { diffDays: 999, text: '상시모집', isAlways: true };
    }

    const endDate = new Date(post.employmentEndDate);

    // 2. 날짜 변환 실패(Invalid Date) 체크
    if (isNaN(endDate.getTime())) {
      return { diffDays: 999, text: '상시모집', isAlways: true };
    }

    const today = new Date();
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      diffDays,
      text:
        diffDays < 0 ? '마감' : diffDays === 0 ? '오늘 마감' : `D-${diffDays}`,
      isAlways: false,
    };
  };

  const { diffDays, text: dDayText, isAlways } = calculateDday();

  // 상시모집이 아니면서 7일 이내인 경우만 '긴급' 표시
  const isUrgent = !isAlways && diffDays <= 0;

  const domainLabel =
    DOMAINS.find((d) => d.value === post.domain)?.label || post.domain;

  return (
    <div className="post-card">
      {/* 1. 헤더: 로고만 남김 */}
      <div className="post-card__header">
        <div className="post-card__logo">{/* 로고 블럭 */}</div>
      </div>

      {/* 2. 제목 + 북마크 버튼 */}
      <div className="post-card__title-row">
        <h3 className="post-card__title">{post.positionTitle}</h3>

        <button
          onClick={handleBookmarkToggle}
          className={`post-card__bookmark-button ${
            isBookmarked ? 'post-card__bookmark-button--bookmarked' : ''
          }`}
          title={isBookmarked ? '찜 해제' : '찜하기'}
        >
          {/* CSS ::before로 별 아이콘 처리 */}
        </button>
      </div>

      {/* 3. 회사명 및 D-Day 정보 */}
      <div className="post-card__info">
        <span className="post-card__company-name">{post.companyName}</span>
        <span className="post-card__info-separator">•</span>
        <span
          className={`post-card__d-day ${
            isUrgent ? 'post-card__d-day--urgent' : ''
          } ${isAlways ? 'post-card__d-day--always' : ''}`}
        >
          {dDayText}
        </span>
      </div>

      {/* 4. 슬로건 */}
      {post.slogan && <p className="post-card__slogan">{post.slogan}</p>}

      {/* 5. 하단 태그 */}
      <div className="post-card__domain">{domainLabel}</div>
    </div>
  );
};

export default PostCard;
