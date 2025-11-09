// src/hooks/usePosts.ts
import { useEffect, useState } from 'react';
import { getPosts } from '../api/post_api';
import type { Paginator, Post } from '../types/post';

/**
 * 포스트 데이터를 가져오는 커스텀 훅
 * @param selectedRoles - 선택된 역할 배열
 * @param selectedDomains - 선택된 도메인 배열
 * @param isActive - 모집 상태 (true: 모집중만, null: 전체)
 * @param order - 정렬 방식 (0: 최신순, 1: 마감순)
 * @param page - 현재 페이지 번호 (0부터 시작)
 * @returns {Object} { posts, paginator, loading, error }
 */
export function usePosts(
  selectedRoles: string[],
  selectedDomains: string[],
  isActive: boolean | null,
  order: 0 | 1,
  page: number,
  bookmarkRefreshKey: number
) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [paginator, setPaginator] = useState<Paginator>({ lastPage: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 모든 필터 상태와 페이지 번호를 의존성 배열로 사용
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchPosts = async () => {
      try {
        const data = await getPosts({
          positionTypes: selectedRoles.length > 0 ? selectedRoles : null,
          domains: selectedDomains.length > 0 ? selectedDomains : null,
          isActive: isActive,
          order: order,
          page: page, // 예시 코드와 같이 0부터 시작하는 페이지 번호를 전달
        });

        setPosts(data.posts);
        setPaginator(data.paginator);
      } catch (err: any) {
        // 💡 예시 코드(usePosts.js)의 401 토큰 만료 처리 로직을 반영합니다.
        // fetch는 401이 발생해도 에러를 던지지 않으므로, API 응답 코드를 확인해야 합니다.
        // 다만, 여기서는 api/post.ts에서 이미 response.ok를 체크하므로,
        // 토큰 만료 시 서버에서 에러 메시지를 던져주거나,
        // 또는 usePosts.js 예시처럼 API 인스턴스에서 토큰 만료 시 새로고침하도록 가정합니다.

        // 여기서는 단순화하여 에러 메시지만 설정합니다.
        const errorMessage =
          err.message || '데이터를 불러오는 데 실패했습니다.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [
    selectedRoles,
    selectedDomains,
    isActive,
    order,
    page,
    bookmarkRefreshKey,
  ]);

  return { posts, paginator, loading, error };
}
