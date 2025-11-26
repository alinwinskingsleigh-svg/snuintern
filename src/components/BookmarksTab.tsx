import React, { useEffect, useState, useCallback } from 'react';
import { getBookmarks } from '../api/post';
import type { Post } from '../types/post';
import BookmarkPostCard from './BookmarkPostCard'; // ✅ 위에서 만든 컴포넌트 import
import '../css/MyPagePostCard.css';

interface BookmarksTabProps {
  token: string;
}

const BookmarksTab: React.FC<BookmarksTabProps> = ({ token }) => {
  const [bookmarks, setBookmarks] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (token) fetchBookmarks();
  }, [token, fetchBookmarks]);

  if (loading) return <div className="loading-msg">로딩 중...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
        찜한 공고가 없습니다.
      </div>
    );
  }

  // ✅ 오류 해결: 이제 변수 걱정 없이 리스트 컨테이너만 작성하면 됩니다.
  return (
    <div className="bookmark-list-container">
      {bookmarks.map((post) => (
        <BookmarkPostCard
          key={post.id}
          post={post}
          onRemove={fetchBookmarks} // 삭제 시 목록 새로고침
        />
      ))}
    </div>
  );
};

export default BookmarksTab;
