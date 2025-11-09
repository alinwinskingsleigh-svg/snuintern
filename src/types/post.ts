// src/types/post.ts

/**
 * API 응답에서 공고 목록의 각 항목에 대한 타입 정의
 */
export interface Post {
  id: string; // post id (찜하기 기능에서 사용) [cite: 463]
  companyName: string; // 회사 이름 [cite: 465]
  employmentEndDate: string; // 마감일 (ISO 8601) [cite: 467]
  positionTitle: string; // e.g. React Frontend 개발자 [cite: 468]
  positionCategory: string; // e.g. 개발 [cite: 471]
  domain: string; // e.g. "FINTECH" [cite: 469]
  slogan: string; // 카드 하단에 들어갈 한 줄 소개 [cite: 470]
  headCount: number; // 모집 인원수 [cite: 472]
  isBookmarked: boolean; // 북마크 여부 (로그인하지 않으면 모두 false) [cite: 473]
  // 기타 필요한 필드는 스펙에 따라 추가
}

/**
 * GET /api/post 응답의 페이지네이션 정보 타입 정의
 */
export interface Paginator {
  lastPage: number; // 마지막 페이지 번호 [cite: 478]
}

/**
 * GET /api/post 전체 응답 데이터 타입 정의
 */
export interface GetPostsResponse {
  posts: Post[]; // 공고 목록 [cite: 461]
  paginator: Paginator; // 페이지네이션 정보 [cite: 477]
}

// 필터링에 사용될 파라미터 타입 정의 (API 요청 시 사용)
export interface GetPostsParams {
  positions?: string[] | null; // 직무 카테고리 이름 (스펙: list(string))
  isActive?: boolean | null; // true: 모집 마감되지 않은 것만
  order?: 0 | 1 | null; // 정렬 기준: 0 → 최신순, 1 → 마감순 (스펙: int)
  domains?: string[] | null; // 도메인 이름 목록 (스펙: list(string))
  page?: number | null; // 페이지네이션 페이지 번호 (스펙: int)
}