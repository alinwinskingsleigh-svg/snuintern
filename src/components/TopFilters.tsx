// src/components/TopFilters.tsx
import React, { useState } from 'react';
import { DOMAINS } from '../constants/post';
import type { GetPostsParams } from '../types/post';

interface TopFiltersProps {
  selectedDomains: string[];
  onDomainToggle: (domain: string) => void;
  isActive: boolean | null;
  onIsActiveChange: (value: boolean | null) => void;
  order: 0 | 1;
  onOrderChange: (value: 0 | 1) => void;
  onResetFilters: () => void;
  
  // 필터 포커싱 (추가 스펙 2)
  isStatusChanged: boolean;
  isDomainsChanged: boolean;
  isSortChanged: boolean;
}

/**
 * 상단 필터 컴포넌트 (모집상태, 업종, 정렬)
 */
const TopFilters: React.FC<TopFiltersProps> = ({
  selectedDomains,
  onDomainToggle,
  isActive,
  onIsActiveChange,
  order,
  onOrderChange,
  onResetFilters,
  isStatusChanged,
  isDomainsChanged,
  isSortChanged
}) => {
  // 드롭다운 내부 상태 관리 (TopFilters.jsx 로직)
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDomainOpen, setIsDomainOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // 모집상태 라벨 업데이트 (추가 스펙 2: 하나만 선택 가능 필터 표시)
  const getStatusLabel = () => {
    if (isActive === true) return '모집중';
    // isActive === false (마감된 것 포함 전체)도 "모집 상태"로 표시
    return '모집 상태';
  };

  // 정렬 라벨 업데이트 (추가 스펙 2: 하나만 선택 가능 필터 표시)
  const getSortLabel = () => {
    if (order === 1) return '마감순';
    return '최신순'; // order === 0 (기본값)
  };

  // 도메인 전체 선택/해제 핸들러 (TopFilters.jsx 로직)
  const handleDomainAllToggle = () => {
    const allSelected = DOMAINS.every(d => selectedDomains.includes(d.value));
    
    // 전체 해제 또는 전체 선택 로직 구현
    DOMAINS.forEach(d => {
        if (allSelected) {
            // 전체 해제 시 이미 선택된 것만 토글
            if (selectedDomains.includes(d.value)) {
                 onDomainToggle(d.value);
            }
        } else {
             // 전체 선택 시 선택 안된 것만 토글
            if (!selectedDomains.includes(d.value)) {
                 onDomainToggle(d.value);
            }
        }
    });
    // NOTE: TopFilters.jsx의 handleDomainAllToggle은 내부 상태를 직접 변경하고 토글 핸들러를 호출하는 방식이어서,
    // onDomainToggle을 여러 번 호출하는 대신, useJobFilter에서 배열을 받아 한 번에 처리하도록 개선하는 것이 일반적입니다.
    // 여기서는 예시 코드를 충실히 따르기 위해 onDomainToggle을 반복 호출합니다.
  };

  // 업종 필터 드롭다운 내 초기화 버튼 (TopFilters.jsx 로직)
  const handleDomainReset = () => {
    // TopFilters.jsx에서는 onDomainToggle을 반복 호출하여 해제했음
    selectedDomains.forEach(domain => onDomainToggle(domain));
  };
  
  // 업종 필터 드롭다운 내 적용 버튼 (TopFilters.jsx 로직)
  const handleApply = () => {
    // TopFilters.jsx 로직: 적용 버튼은 드롭다운을 닫는 역할만 수행
    setIsDomainOpen(false);
  };
  
  // 드롭다운 토글 함수
  const toggleDropdown = (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean) => {
    // 다른 드롭다운 닫기 로직 (TopFilters.jsx 로직)
    setIsStatusOpen(false);
    setIsDomainOpen(false);
    setIsSortOpen(false);
    setter(!current);
  };
  
  // TODO: CSS 파일이 없으므로 인라인 스타일로 임시 적용
  const dropdownToggleStyle: React.CSSProperties = {
      padding: '8px 15px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: 'white',
      marginRight: '10px'
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{ display: 'flex' }}>
        
        {/* 1. 모집 상태 드롭다운 */}
        <div className="filter-dropdown" style={{ position: 'relative' }}>
          <button 
            className={`filter-dropdown-toggle ${isStatusChanged ? 'changed' : ''}`}
            onClick={() => toggleDropdown(setIsStatusOpen, isStatusOpen)}
            style={{ ...dropdownToggleStyle, fontWeight: isStatusChanged ? 'bold' : 'normal', minWidth: '120px' }}
          >
            <span>{getStatusLabel()}</span>
            <span className="arrow">▼</span>
          </button>
          
          {isStatusOpen && (
            <div className="filter-dropdown-menu" style={{ position: 'absolute', border: '1px solid #ccc', backgroundColor: 'white', zIndex: 10, padding: '10px', borderRadius: '4px', marginTop: '5px' }}>
              {/* 전체 */}
              <label style={{ display: 'block', marginBottom: '5px' }}>
                <input
                  type="radio"
                  name="status"
                  checked={isActive === null}
                  onChange={() => {
                    onIsActiveChange(null);
                    setIsStatusOpen(false);
                  }}
                />
                <span>전체</span>
              </label>
              {/* 모집중 */}
              <label style={{ display: 'block' }}>
                <input
                  type="radio"
                  name="status"
                  checked={isActive === true}
                  onChange={() => {
                    onIsActiveChange(true);
                    setIsStatusOpen(false);
                  }}
                />
                <span>모집중</span>
              </label>
            </div>
          )}
        </div>

        {/* 2. 업종 (도메인) 드롭다운 */}
        <div className="filter-dropdown" style={{ position: 'relative' }}>
          <button 
            className={`filter-dropdown-toggle ${isDomainsChanged ? 'changed' : ''}`}
            onClick={() => toggleDropdown(setIsDomainOpen, isDomainOpen)}
            style={{ ...dropdownToggleStyle, fontWeight: isDomainsChanged ? 'bold' : 'normal', minWidth: '100px' }}
          >
            <span>업종</span>
            <span className="arrow">▼</span>
          </button>
          
          {isDomainOpen && (
            <div className="filter-dropdown-menu domain-menu" style={{ position: 'absolute', border: '1px solid #ccc', backgroundColor: 'white', zIndex: 10, padding: '10px', borderRadius: '4px', marginTop: '5px' }}>
              {/* 전체 선택 */}
              <label style={{ display: 'block', marginBottom: '5px' }}>
                <input
                  type="checkbox"
                  checked={DOMAINS.every(d => selectedDomains.includes(d.value))}
                  onChange={handleDomainAllToggle}
                />
                <span>전체</span>
              </label>
              
              {/* 개별 도메인 */}
              {DOMAINS.map(domain => (
                <label key={domain.value} style={{ display: 'block', margin: '3px 0' }}>
                  <input
                    type="checkbox"
                    checked={selectedDomains.includes(domain.value)}
                    onChange={() => onDomainToggle(domain.value)}
                  />
                  <span>{domain.label}</span>
                </label>
              ))}
              
              {/* 초기화 및 적용 버튼 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                <button onClick={handleDomainReset} style={{ padding: '5px 10px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', cursor: 'pointer' }}>초기화</button>
                <button onClick={handleApply} style={{ padding: '5px 10px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>적용</button>
              </div>
            </div>
          )}
        </div>

        {/* 3. 정렬 드롭다운 */}
        <div className="filter-dropdown" style={{ position: 'relative' }}>
          <button 
            className={`filter-dropdown-toggle ${isSortChanged ? 'changed' : ''}`}
            onClick={() => toggleDropdown(setIsSortOpen, isSortOpen)}
            style={{ ...dropdownToggleStyle, fontWeight: isSortChanged ? 'bold' : 'normal', minWidth: '100px' }}
          >
            <span>{getSortLabel()}</span>
            <span className="arrow">▼</span>
          </button>
          
          {isSortOpen && (
            <div className="filter-dropdown-menu" style={{ position: 'absolute', border: '1px solid #ccc', backgroundColor: 'white', zIndex: 10, padding: '10px', borderRadius: '4px', marginTop: '5px' }}>
              {/* 최신순 (order: 0) */}
              <label style={{ display: 'block', marginBottom: '5px' }}>
                <input
                  type="radio"
                  name="sort"
                  checked={order === 0}
                  onChange={() => {
                    onOrderChange(0);
                    setIsSortOpen(false);
                  }}
                />
                <span>최신순</span>
              </label>
              {/* 마감순 (order: 1) */}
              <label style={{ display: 'block' }}>
                <input
                  type="radio"
                  name="sort"
                  checked={order === 1}
                  onChange={() => {
                    onOrderChange(1);
                    setIsSortOpen(false);
                  }}
                />
                <span>마감순</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* 4. 전체 초기화 버튼 */}
      <button 
        onClick={onResetFilters}
        style={{ padding: '8px 15px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', cursor: 'pointer' }}
      >
        <span className="refresh-icon" style={{ marginRight: '5px' }}>↻</span> 초기화
      </button>
    </div>
  );
}

export default TopFilters;