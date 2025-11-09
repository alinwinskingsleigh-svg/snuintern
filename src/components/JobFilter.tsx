// src/components/JobFilter.tsx
import { POSITION_CATEGORIES } from '../constants/post';
import type { PositionCategoryKey, PositionValue } from '../constants/post';

interface JobFilterProps {
  selectedRoles: string[];
  onRoleToggle: (role: PositionValue) => void;
  onCategoryAllToggle: (categoryKey: PositionCategoryKey) => void;
  isFilterOpen: boolean;
  // onToggleFilter: () => void; // 예시 코드에 있었으나, 현재는 LandingPage에서 isFilterOpen을 직접 관리하지 않으므로 생략 (필요하다면 추가 가능)
}

/**
 * 직군 필터 컴포넌트 (사이드바 스타일)
 */
const JobFilter = ({
  selectedRoles,
  onRoleToggle,
  onCategoryAllToggle,
  isFilterOpen,
  // onToggleFilter
}: JobFilterProps) => {
  return (
    <aside
      className="job-filter-sidebar"
      style={{
        // 임시 스타일: JobFilter.jsx와 유사하게 사이드바 형태 유지
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '10px',
        minWidth: '200px',
      }}
    >
      <div
        // onClick={onToggleFilter} // 토글 버튼 기능 (필요하다면 추가)
        style={{
          padding: '10px 0',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>직군 필터</span>
        <span className={`arrow ${isFilterOpen ? 'open' : ''}`}>▼</span>
      </div>

      {/* isFilterOpen이 true일 때만 내용 표시 (JobFilter.jsx 로직) */}
      {isFilterOpen && (
        <div className="job-filter-content open" style={{ marginTop: '10px' }}>
          {Object.entries(POSITION_CATEGORIES).map(([category, data]) => {
            const categoryKey = category as PositionCategoryKey;

            // 현재 카테고리의 모든 역할이 선택되었는지 확인 (JobFilter.jsx 로직)
            const isAllSelected = data.roles.every((r) =>
              selectedRoles.includes(r.value)
            );

            return (
              <div
                key={categoryKey}
                className="filter-category"
                style={{ marginBottom: '15px' }}
              >
                <h3 style={{ fontSize: '1em', fontWeight: 'bold' }}>
                  {category}
                </h3>

                {/* 전체 선택 */}
                <label style={{ display: 'block', margin: '5px 0' }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={() => onCategoryAllToggle(categoryKey)}
                    style={{ marginRight: '5px' }}
                  />
                  <span>전체</span>
                </label>

                {/* 개별 직무 */}
                {data.roles.map((role) => (
                  <label
                    key={role.value}
                    style={{
                      display: 'block',
                      marginLeft: '15px',
                      margin: '3px 0',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.value)}
                      onChange={() => onRoleToggle(role.value)}
                      style={{ marginRight: '5px' }}
                    />
                    <span>{role.label}</span>
                  </label>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
};

export default JobFilter;
