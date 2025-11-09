import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { POSITION_CATEGORIES } from '../constants/post';
import type { GetPostsParams } from '../types/post';
// 'PositionValue'와 'PositionCategoryKey' 타입이 constants/post.ts에 정의되어 있어야 합니다.
import type { PositionValue, PositionCategoryKey } from '../constants/post';

/**
 * URL 쿼리 파라미터와 localStorage에서 초기 필터 상태를 읽어오는 헬퍼 함수
 * (react-week5 예시 기반)
 */
const getInitialState = (key: keyof GetPostsParams, defaultValue: any): any => {
  // 1순위: URL 쿼리 파라미터
  const searchParams = new URLSearchParams(window.location.search);
  
  // 'positionTypes' (직군) 또는 'domains' (업종)는 배열(getAll)로 읽어옴
  if (key === 'positionTypes' || key === 'domains') {
    const urlParams = searchParams.getAll(key);
    if (urlParams.length > 0) return urlParams;
  } else {
  // 나머지는 단일 값(get)으로 읽어옴
    const urlParam = searchParams.get(key);
    if (urlParam !== null) {
      if (key === 'isActive') return urlParam === 'true';
      if (key === 'order' || key === 'page') return parseInt(urlParam, 10);
      return urlParam;
    }
  }
  
  // 2순위: localStorage (추가 스펙 3: 필터 저장)
  const stored = localStorage.getItem('filterState');
  if (stored) {
    const parsed = JSON.parse(stored);
    // 💡 여기서 'key'는 'positionTypes'임
    return parsed[key] !== undefined && parsed[key] !== null ? parsed[key] : defaultValue;
  }
  
  // 3순위: 기본값
  return defaultValue;
};

/**
 * 직무 및 상단 필터 로직을 관리하는 커스텀 훅
 * (변수명: selectedRoles / API 파라미터 키: positionTypes)
 */
export function useJobFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 💡 1. 상태 초기화 (API 키 'positionTypes'로 localStorage/URL에서 읽어옴)
  const [selectedRoles, setSelectedRoles] = useState<PositionValue[]>(() => 
    getInitialState('positionTypes', []) as PositionValue[]
  );
  const [selectedDomains, setSelectedDomains] = useState<string[]>(() => 
    getInitialState('domains', []) as string[]
  );
  const [isActive, setIsActive] = useState<boolean | null>(() => 
    getInitialState('isActive', null)
  );
  const [order, setOrder] = useState<0 | 1>(() => 
    getInitialState('order', 0)
  );

  // 💡 2. localStorage 저장 (API 키 'positionTypes'로 저장)
  useEffect(() => {
    const filterState = {
      positionTypes: selectedRoles,
      domains: selectedDomains,
      isActive,
      order
    };
    localStorage.setItem('filterState', JSON.stringify(filterState));
  }, [selectedRoles, selectedDomains, isActive, order]);

  /**
   * 💡 3. URL 업데이트 함수 (API 키 'positionTypes'로 업데이트)
   * 모든 필터 핸들러는 이 함수를 호출하여 URL을 변경합니다.
   * (react-week5 예시의 updateFiltersInUrl 참조)
   */
  const updateSearchParams = useCallback((
    newRoles: PositionValue[], 
    newDomains: string[], 
    newActive: boolean | null, 
    newOrder: 0 | 1,
    resetPage: boolean = true // 필터 변경 시 1페이지로 리셋
  ) => {
    const params = new URLSearchParams(searchParams);

    // positionTypes (API 키 'positionTypes' 사용)
    params.delete('positionTypes'); 
    newRoles.forEach(role => params.append('positionTypes', role));

    // Domains
    params.delete('domains');
    newDomains.forEach(domain => params.append('domains', domain));

    // isActive
    params.delete('isActive');
    if (newActive !== null) {
      params.set('isActive', String(newActive));
    }

    // Order
    params.set('order', String(newOrder));
    
    // Page (필터 변경 시 1페이지(0)로 리셋)
    if (resetPage) {
        params.set('page', '0'); 
    } else {
        if (!params.get('page')) {
            params.set('page', '0');
        }
    }
    setSearchParams(params);
  }, [searchParams, setSearchParams]);


  // --- 핸들러 함수들 ---

  const handleRoleToggle = useCallback((role: PositionValue) => {
    setSelectedRoles(prev => {
      const newRoles = prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role];
      // URL 업데이트 -> LandingPage가 URL 변경 감지 -> usePosts 재실행
      updateSearchParams(newRoles, selectedDomains, isActive, order);
      return newRoles;
    });
  }, [selectedDomains, isActive, order, updateSearchParams]);

  const handleCategoryAllToggle = useCallback((categoryKey: PositionCategoryKey) => {
    const category = POSITION_CATEGORIES[categoryKey];
    const categoryRoleValues = category.roles.map(r => r.value) as PositionValue[];
    const allSelected = categoryRoleValues.every(role => selectedRoles.includes(role));
    
    setSelectedRoles(prev => {
        let newRoles: PositionValue[];
        const filteredPrev = prev.filter(role => !categoryRoleValues.includes(role));
        if (allSelected) { // 전부 선택된 상태 -> 전부 해제
            newRoles = filteredPrev;
        } else { // 일부만 선택/미선택 -> 전부 선택
            newRoles = [...filteredPrev, ...categoryRoleValues];
        }
        updateSearchParams(newRoles, selectedDomains, isActive, order);
        return newRoles;
    });
  }, [selectedRoles, selectedDomains, isActive, order, updateSearchParams]);

  const handleDomainToggle = useCallback((domain: string) => {
    setSelectedDomains(prev => {
      const newDomains = prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain];
      updateSearchParams(selectedRoles, newDomains, isActive, order);
      return newDomains;
    });
  }, [selectedRoles, isActive, order, updateSearchParams]);

  const handleIsActiveChange = useCallback((value: boolean | null) => {
    setIsActive(value);
    updateSearchParams(selectedRoles, selectedDomains, value, order);
  }, [selectedRoles, selectedDomains, order, updateSearchParams]);

  const handleOrderChange = useCallback((value: 0 | 1) => {
    setOrder(value);
    updateSearchParams(selectedRoles, selectedDomains, isActive, value);
  }, [selectedRoles, selectedDomains, isActive, updateSearchParams]);
  
  /**
   * 💡 4. 필터 초기화 버튼 로직
   * (react-week5 예시의 handleResetFilters 참조)
   */
  const handleResetFilters = useCallback(() => {
    // 직군 필터를 포함하여 변경 사항이 있는지 확인
    const hasChanges = selectedRoles.length > 0 || selectedDomains.length > 0 || isActive !== null || order !== 0;
    if (!hasChanges) return; // 변경된 것이 없으면 함수 종료
    
    // 모든 필터 상태를 초기화
    setSelectedRoles([]);
    setSelectedDomains([]);
    setIsActive(null);
    setOrder(0);
    
    // URL 업데이트 (모든 필터 초기화, page 리셋)
    updateSearchParams([], [], null, 0, true); 

  }, [selectedRoles.length, selectedDomains.length, isActive, order, updateSearchParams]);

  // 필터 포커싱 (추가 스펙 2)
  const isRolesChanged = selectedRoles.length > 0;
  const isStatusChanged = isActive !== null;
  const isDomainsChanged = selectedDomains.length > 0;
  const isSortChanged = order !== 0;
  
  return {
    selectedRoles, // 변수명은 'selectedRoles' 유지
    selectedDomains,
    isActive,
    order,
    handleRoleToggle,
    handleCategoryAllToggle,
    handleDomainToggle,
    handleIsActiveChange,
    handleOrderChange,
    handleResetFilters, // 초기화 핸들러 반환
    isRolesChanged,
    isStatusChanged,
    isDomainsChanged,
    isSortChanged,
  };
}