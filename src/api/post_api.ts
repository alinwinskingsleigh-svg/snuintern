// src/api/post.ts
import type { GetPostsParams, GetPostsResponse } from '../types/post';
import { encodeQueryParams } from '../utils/query';

// 모든 API 요청에 공통으로 필요한 헤더(JWT 포함)를 구성하는 유틸리티 함수입니다.
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // 예시 코드(usePosts.js)와 동일하게 토큰이 있을 경우 Authorization 헤더에 추가
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * 공고 목록을 필터링 및 페이지네이션하여 가져옵니다. (GET /api/post)
 * @param params 필터링 및 페이지네이션을 위한 쿼리 파라미터
 * @returns 공고 목록과 페이지네이션 정보
 */
export const getPosts = async (
  params: GetPostsParams
): Promise<GetPostsResponse> => {
  // 쿼리 파라미터 인코딩
  const queryString = encodeQueryParams({
    params: params as Record<string, any>,
  });

  // 💡 fetch API 사용
  const response = await fetch(`/api/post?${queryString}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    // 401 에러는 usePosts 훅에서 직접 처리하도록 로직 분리 (예시 코드 참고)
    // 여기서는 기본 에러만 던집니다.
    throw new Error(
      `Failed to fetch posts: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * 특정 공고를 찜합니다. (POST api/post/{post_id}/bookmark)
 * @param postId 찜할 공고의 ID
 */
export const bookmarkPost = async (postId: string): Promise<void> => {
  const response = await fetch(`/api/post/${postId}/bookmark`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to bookmark post: ${response.statusText}`);
  }
};

/**
 * 특정 공고의 찜을 해제합니다. (DELETE api/post/{post_id}/bookmark)
 * @param postId 찜 해제할 공고의 ID
 */
export const unbookmarkPost = async (postId: string): Promise<void> => {
  const response = await fetch(`/api/post/${postId}/bookmark`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to unbookmark post: ${response.statusText}`);
  }
};
