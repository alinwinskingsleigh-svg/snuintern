import React, { useState } from 'react';
import { unbookmarkPost } from '../api/post_api'; // ✅ API 함수 가져오기
import { POSITION_CATEGORIES } from '../constants/post';
import type { Post } from '../types/post';
import '../css/MyPagePostCard.css';

interface BookmarkPostCardProps {
  post: Post;
  onRemove: () => void; // 목록에서 제거(새로고침)하는 함수
}

const BookmarkPostCard: React.FC<BookmarkPostCardProps> = ({
  post,
  onRemove,
}) => {
  // 1. 상태 관리: 북마크 탭이므로 기본값은 true
  const [isBookmarked, setIsBookmarked] = useState(true);

  // 2. D-day 계산 로직 (PostCard.tsx에서 가져옴)
  const calculateDday = () => {
    const endDate = new Date(post.employmentEndDate);
    const today = new Date();
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      diffDays,
      text:
        diffDays < 0 ? '마감' : diffDays === 0 ? '오늘 마감' : `D-${diffDays}`,
    };
  };

  const { diffDays, text: dDayText } = calculateDday();
  const isDue = diffDays <= 0;

  // 3. 찜 해제 핸들러 (PostCard.tsx 로직 응용)
  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지

    // 화면에서 먼저 별을 비움 (낙관적 업데이트)
    setIsBookmarked(false);

    try {
      // API 호출: 찜 해제
      await unbookmarkPost(post.id);

      // 목록 갱신: 사용자가 "해제됐구나" 인식할 시간을 주고 목록에서 삭제
      setTimeout(() => {
        onRemove();
      }, 300);
    } catch (error) {
      console.error(`Failed to unbookmark post ${post.id}`, error);
      // 실패 시 다시 채워진 별로 복구
      setIsBookmarked(true);
      alert('찜 해제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // ✅ [추가] 직무 타입 코드(예: 'frontend')를 한글 라벨(예: '프론트엔드 개발')로 바꿔주는 함수
  const getPositionLabel = (typeValue?: string) => {
    if (!typeValue) return '직무 내용';

    // 1. 모든 카테고리('개발', '기획', ...)를 순회
    for (const category of Object.values(POSITION_CATEGORIES)) {
      // 2. 해당 카테고리의 roles 배열에서 일치하는 value를 찾음
      const foundRole = category.roles.find((role) => role.value === typeValue);
      // 3. 찾았으면 그 라벨을 반환
      if (foundRole) {
        return foundRole.label;
      }
    }
    // 4. 만약 목록에 없는 값이면 원래 값을 그대로 보여줌
    return typeValue;
  };

  // 4. UI 렌더링 (원하시는 Left-Center-Right 구조)
  return (
    <div className="bookmark-row-card">
      {/* 왼쪽: 북마크 버튼 */}
      <div className="bookmark-row-card__left">
        <button
          onClick={handleBookmarkToggle}
          className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
          title="찜 해제"
          type="button"
        >
          {/* CSS ::before로 별 모양 처리됨 */}
        </button>
      </div>

      {/* 가운데: 회사 이름 */}
      <div className="bookmark-row-card__center">
        <span className="company-name">{post.companyName || '회사명'}</span>
      </div>

      {/* 오른쪽: 직무 정보 + 마감일 */}
      <div className="bookmark-row-card__right">
        <span className="role-type">
          {getPositionLabel(post.positionType) || '직무 내용'}
        </span>
        <span className={`d-day ${isDue ? 'urgent' : ''}`}>{dDayText}</span>
      </div>
    </div>
  );
};

export default BookmarkPostCard;
