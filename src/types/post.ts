// src/types/post.ts

/**
 * API 응답에서 공고 목록의 각 항목에 대한 타입 정의
 */
export interface Post {
  id: string;
  companyName: string;
  employmentEndDate: string;
  positionTitle: string;
  positionType: string;
  domain: string;
  slogan: string;
  headCount: number;
  isBookmarked: boolean;
}

/**
 * GET /api/post 응답의 페이지네이션 정보 타입 정의
 */
export interface Paginator {
  lastPage: number;
}

/**
 * GET /api/post 전체 응답 데이터 타입 정의
 */
export interface GetPostsResponse {
  posts: Post[];
  paginator: Paginator;
}

/**
 * 필터링에 사용될 파라미터 타입 정의 (API 요청 시 사용)
 * ✅ 'positionTypes'로 수정 (API 명세에 맞춤)
 */
export interface GetPostsParams {
  positionTypes?: string[] | null;
  isActive?: boolean | null;
  order?: 0 | 1 | null;
  domains?: string[] | null;
  page?: number | null;
}