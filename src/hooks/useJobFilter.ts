// src/hooks/useJobFilter.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { POSITION_CATEGORIES, DOMAIN_VALUES } from '../constants/post';
import type { GetPostsParams } from '../types/post';
import type { PositionValue, PositionCategoryKey } from '../constants/post';

// 예시 코드에 따라 'roles'를 URL에서 읽고 쓰는 로직을 반영합니다.

/**
 * 직무 및 상단 필터 로직을 관리하는 커스텀 훅
 * URLSearchParams, localStorage와 동기화합니다.
 */
export function useJobFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL 또는 localStorage에서 초기 상태를 읽어오는 헬퍼 함수
  const getInitialState = (key: keyof GetPostsParams, defaultValue: any): any => {
    // 1. URLSearchParams에서 읽기 (배열은 getAll, 단일값은 get)
    if (key === 'positions' || key === 'domains') {
      const urlParams = searchParams.getAll(key);
      if (urlParams.length > 0) return urlParams;
    } else {
      const urlParam = searchParams.get(key);
      if (urlParam !== null) {
        if (key === 'isActive') return urlParam === 'true';
        if (key === 'order' || key === 'page') return parseInt(urlParam, 10);
        return urlParam;
      }
    }
    
    // 2. localStorage에서 읽기 (추가 스펙 3: 필터 저장)
    const stored = localStorage.getItem('filterState');
    if (stored) {
      const parsed = JSON.parse(stored);
      // null 값은 undefined로 처리하여 기본값 사용을 유도
      return parsed[key] !== undefined && parsed[key] !== null ? parsed[key] : defaultValue;
    }
    
    // 3. 기본값
    return defaultValue;
  };

  const [selectedRoles, setSelectedRoles] = useState<PositionValue[]>(() => 
    getInitialState('positions', []) as PositionValue[]
);

  const [selectedDomains, setSelectedDomains] = useState<string[]>(() => getInitialState('domains', []) as string[]);
  // isActive는 null (전체)로 시작하는 것이 UI상 자연스러움
  const [isActive, setIsActive] = useState<boolean | null>(() => getInitialState('isActive', null));
  const [order, setOrder] = useState<0 | 1>(() => getInitialState('order', 0)); // 0: 최신순
  // 페이지는 URL에서 직접 관리하고 usePosts에서 사용하므로, 훅 내부 상태에서는 관리하지 않습니다.

  // 필터 상태를 localStorage에 저장 (추가 스펙 3)
  useEffect(() => {
    const filterState = {
      positions: selectedRoles,
      domains: selectedDomains,
      isActive,
      order
    };
    localStorage.setItem('filterState', JSON.stringify(filterState));
  }, [selectedRoles, selectedDomains, isActive, order]);

  // URL 파라미터를 업데이트하는 범용 함수
  const updateSearchParams = useCallback((
    newRoles: string[], 
    newDomains: string[], 
    newActive: boolean | null, 
    newOrder: 0 | 1,
    resetPage: boolean = true // 필터 변경 시 페이지를 1(0)로 리셋 (스펙)
  ) => {
    const params = new URLSearchParams(searchParams);

    // 1. Roles 업데이트
    params.delete('positions');
    newRoles.forEach(role => params.append('positions', role));

    // 2. Domains 업데이트
    params.delete('domains');
    newDomains.forEach(domain => params.append('domains', domain));

    // 3. isActive 업데이트
    params.delete('isActive');
    if (newActive !== null) {
      params.set('isActive', String(newActive));
    }

    // 4. Order 업데이트
    params.set('order', String(newOrder));
    
    // 5. 페이지 리셋 (스펙: 필터 변경 시 페이지네이션 1로 돌아옴)
    if (resetPage) {
        params.set('page', '0'); // 예시 코드(PostIndex.jsx)는 페이지를 0부터 시작
    } else {
        // 현재 페이지 유지
        if (!params.get('page')) {
            params.set('page', '0');
        }
    }

    setSearchParams(params);
  }, [searchParams, setSearchParams]);


  // --- 필터 핸들러들 ---

  // 역할 선택/해제 핸들러
  const handleRoleToggle = useCallback((role: PositionValue) => {
    setSelectedRoles(prev => {
      const newRoles = prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role];
      
      updateSearchParams(newRoles, selectedDomains, isActive, order);
      return newRoles;
    });
  }, [selectedDomains, isActive, order, updateSearchParams]);

  // 카테고리 전체 선택/해제 핸들러 (개발, 기획, 디자인 등)
  const handleCategoryAllToggle = useCallback((categoryKey: PositionCategoryKey) => {
    const category = POSITION_CATEGORIES[categoryKey];
    const categoryRoleValues = category.roles.map(r => r.value) as PositionValue[];
    const allSelected = categoryRoleValues.every(role => selectedRoles.includes(role));
    
    setSelectedRoles(prev => {
      const newRoles = allSelected
        ? prev.filter(role => !categoryRoleValues.includes(role))
        : [
          ...prev.filter(role => !categoryRoleValues.includes(role)), 
          ...categoryRoleValues
        ];
      
      updateSearchParams(newRoles, selectedDomains, isActive, order);
      return newRoles as PositionValue[];
    });
  }, [selectedRoles, selectedDomains, isActive, order, updateSearchParams]);

  // 도메인 선택/해제 핸들러
  const handleDomainToggle = useCallback((domain: string) => {
    setSelectedDomains(prev => {
      const newDomains = prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain];
      
      updateSearchParams(selectedRoles, newDomains, isActive, order);
      return newDomains;
    });
  }, [selectedRoles, isActive, order, updateSearchParams]);

  // 모집 상태 변경 핸들러
  const handleIsActiveChange = useCallback((value: boolean | null) => {
    setIsActive(value);
    updateSearchParams(selectedRoles, selectedDomains, value, order);
  }, [selectedRoles, selectedDomains, order, updateSearchParams]);

  // 정렬 변경 핸들러
  const handleOrderChange = useCallback((value: 0 | 1) => {
    setOrder(value);
    updateSearchParams(selectedRoles, selectedDomains, isActive, value);
  }, [selectedRoles, selectedDomains, isActive, updateSearchParams]);
  
  // 전체 초기화 핸들러 (직군은 유지 - 예시 코드 기준)
  const handleResetFilters = useCallback(() => {
    const hasChanges = selectedDomains.length > 0 || isActive !== null || order !== 0;
    
    // 변경사항이 없으면 아무것도 하지 않음 (예시 코드 로직)
    if (!hasChanges) return;
    
    // 상태 초기화
    setSelectedDomains([]);
    setIsActive(null);
    setOrder(0);
    
    // URL 업데이트 (roles는 유지, page도 유지)
    updateSearchParams(selectedRoles, [], null, 0); // updateSearchParams에서 페이지는 초기화됩니다.
  }, [selectedRoles, updateSearchParams, selectedDomains.length, isActive, order]);


  // 필터 적용 상태 확인 (추가 스펙 2: 필터 포커싱)
  const isStatusChanged = isActive !== null;
  const isDomainsChanged = selectedDomains.length > 0;
  const isSortChanged = order !== 0;
  // 직군 필터는 roles 배열이 비어있는지 여부로 판단
  const isRolesChanged = selectedRoles.length > 0; 
  
  return {
    // 상태
    selectedRoles,
    selectedDomains,
    isActive,
    order,
    // 핸들러
    handleRoleToggle,
    handleCategoryAllToggle,
    handleDomainToggle,
    handleIsActiveChange,
    handleOrderChange,
    handleResetFilters,
    // 필터 변경 여부
    isStatusChanged,
    isDomainsChanged,
    isSortChanged,
    isRolesChanged,
    // 유틸리티
    updateSearchParams, // 페이지네이션 등 외부에서 URL 업데이트 시 필요
  };
}