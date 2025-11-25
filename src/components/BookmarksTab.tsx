import React, { useEffect, useState, useCallback } from 'react';
import { getBookmarks } from '../api/post';
import type { Post } from '../types/post';
import PostCard from './PostCard';
import '../css/MyPagePostCard.css';

interface BookmarksTabProps {
  token: string;
}

const BookmarksTab: React.FC<BookmarksTabProps> = ({ token }) => {
  const [bookmarks, setBookmarks] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ 수정 포인트: fetchBookmarks를 useCallback으로 감싸서 메모이제이션
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
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchBookmarks();
    }
  }, [token, fetchBookmarks]);

  if (loading) return <div className="loading-msg">로딩 중...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          color: '#666',
          gridColumn: '1 / -1',
        }}
      >
        찜한 공고가 없습니다.
      </div>
    );
  }

  return (
    <>
      {bookmarks.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLoginRequired={() => alert('로그인이 필요합니다.')}
          refreshPosts={fetchBookmarks} // 북마크 해제 시 목록 갱신을 위해 전달
        />
      ))}
    </>
  );
};

export default BookmarksTab;
