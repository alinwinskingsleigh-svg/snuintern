// src/hooks/usePosts.ts
import { useEffect, useState } from "react";
import { getPosts } from "../api/post_api";
import type { Paginator, Post } from "../types/post";

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
  bookmarkRefreshKey: number,
) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [paginator, setPaginator] = useState<Paginator>({ lastPage: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 모든 필터 상태와 페이지 번호를 의존성 배열로 사용
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchPosts = async () => {
      try {
        void bookmarkRefreshKey; // bookmarkRefreshKey 사용 방지
        const data = await getPosts({
          roles: selectedRoles.length > 0 ? selectedRoles : null,
          domains: selectedDomains.length > 0 ? selectedDomains : null,
          isActive: isActive,
          order: order,
          page: page, // 예시 코드와 같이 0부터 시작하는 페이지 번호를 전달
        });

        setPosts(data.posts);
        setPaginator(data.paginator);
      } catch (err: unknown) {
        // 💡 401 Unauthorized 에러 처리 로직을 추가합니다.
        // api/post_api.ts에서 던진 에러 메시지에 "401"이 포함되어 있는지 확인합니다.
        if (err instanceof Error && err.message.includes("401")) {
          // 토큰이 만료되었거나 유효하지 않으므로, 로컬 스토리지에서 토큰을 제거합니다.
          localStorage.removeItem("token");
          // 사용자에게 알리고 페이지를 새로고침하여 로그인 상태를 초기화합니다.
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          window.location.reload(); // 페이지 새로고침
          return; // 추가적인 에러 상태 업데이트를 막기 위해 여기서 함수를 종료합니다.
        }

        // `unknown` 타입의 에러를 안전하게 처리합니다.
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("데이터를 불러오는 데 실패했습니다.");
        }
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
