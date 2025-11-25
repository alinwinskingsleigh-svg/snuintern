import React, { useEffect, useState, useCallback } from 'react';
import { getBookmarks } from '../api/post';
import type { Post } from '../types/post';
import PostCard from './PostCard';
import '../css/MyPagePostCard.css';

const BookmarksTab: React.FC<{ token: string }> = ({ token }) => {
  const [bookmarks, setBookmarks] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ 수정 포인트 1: fetchBookmarks를 useCallback으로 감싸서 메모이제이션합니다.
  // token이 바뀔 때만 이 함수가 새로 생성되도록 합니다.
  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBookmarks(token);
      setBookmarks(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [token]); // token을 의존성 배열에 추가

  useEffect(() => {
    if (token) {
      fetchBookmarks();
    }
    // ✅ 수정 포인트 2: 이제 fetchBookmarks를 의존성 배열에 넣어도 무한 루프가 발생하지 않습니다.
  }, [token, fetchBookmarks]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        찜한 공고가 없습니다.
      </div>
    );
  }

  return (
    <div className="mypage-card-list">
      {bookmarks.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLoginRequired={() => alert('로그인이 필요합니다.')}
          // 여기서 함수를 전달하므로 fetchBookmarks는 useEffect 밖(컴포넌트 스코프)에 있어야 합니다.
          refreshPosts={fetchBookmarks}
        />
      ))}
    </div>
  );
};

export default BookmarksTab;
