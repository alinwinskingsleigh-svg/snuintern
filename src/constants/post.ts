// src/constants/post.ts

// 직무 카테고리 (API 파라미터 값)
export const POSITION_VALUES = {
  FRONTEND: 'FRONT',
  BACKEND: 'BACKEND',
  APP: 'APP',
  DATA: 'DATA',
  OTHERS: 'OTHERS', // 개발 기타 분야
  DESIGN: 'DESIGN',
  PLANNER: 'PLANNER',
  MARKETING: 'MARKETING',
} as const;

export type PositionValue =
  (typeof POSITION_VALUES)[keyof typeof POSITION_VALUES];

// 직무 필터 UI 매핑
export const POSITION_CATEGORIES = {
  개발: {
    label: '개발', // UI 표시용
    roles: [
      { value: POSITION_VALUES.FRONTEND, label: '프론트엔드 개발' },
      { value: POSITION_VALUES.BACKEND, label: '서버 · 백엔드 개발' },
      { value: POSITION_VALUES.APP, label: '앱 개발' },
      { value: POSITION_VALUES.DATA, label: '데이터' },
      { value: POSITION_VALUES.OTHERS, label: '기타 분야' },
    ],
  },
  기획: {
    label: '기획',
    roles: [{ value: POSITION_VALUES.PLANNER, label: '기획' }],
  },
  디자인: {
    label: '디자인',
    roles: [{ value: POSITION_VALUES.DESIGN, label: '디자인' }],
  },
  마케팅: {
    label: '마케팅',
    roles: [{ value: POSITION_VALUES.MARKETING, label: '마케팅' }],
  },
} as const;

// 모든 개발 직군 값 (개발 전체 선택 시 사용)
export const ALL_DEV_POSITIONS = POSITION_CATEGORIES.개발.roles.map(
  (r) => r.value
);

export type PositionCategoryKey = keyof typeof POSITION_CATEGORIES;

// 도메인 (업종) 목록 (API 파라미터 값)
export const DOMAINS = [
  { value: 'FINTECH', label: '핀테크' },
  { value: 'HEALTHTECH', label: '헬스테크' },
  { value: 'EDUCATION', label: '교육' },
  { value: 'ECOMMERCE', label: '이커머스' },
  { value: 'FOODTECH', label: '푸드테크' },
  { value: 'MOBILITY', label: '모빌리티' },
  { value: 'CONTENTS', label: '콘텐츠' },
  { value: 'B2B', label: 'B2B' },
  { value: 'OTHERS', label: '기타' },
] as const;

export const DOMAIN_VALUES = DOMAINS.map((d) => d.value);
