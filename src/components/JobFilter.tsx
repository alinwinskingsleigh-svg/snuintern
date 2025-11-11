// src/components/JobFilter.tsx
import { POSITION_CATEGORIES } from '../constants/post';
import type { PositionCategoryKey, PositionValue } from '../constants/post';

interface JobFilterProps {
  selectedRoles: string[];
  onRoleToggle: (role: PositionValue) => void;
  onCategoryAllToggle: (categoryKey: PositionCategoryKey) => void;
  isFilterOpen: boolean;
  onToggleFilter: () => void; // ✅ 추가됨
}

const JobFilter = ({
  selectedRoles,
  onRoleToggle,
  onCategoryAllToggle,
  isFilterOpen,
  onToggleFilter,
}: JobFilterProps) => {
  return (
    <aside
      className="job-filter-sidebar"
      style={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '10px',
        minWidth: '200px',
        background: '#fafafa',
      }}
    >
      {/* 필터 헤더 */}
      <div
        onClick={onToggleFilter}
        style={{
          padding: '10px 0',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <span>직군 필터</span>
        <span
          className={`arrow ${isFilterOpen ? 'open' : ''}`}
          style={{
            transition: 'transform 0.3s',
            transform: isFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▼
        </span>
      </div>

      {/* 내용 영역 */}
      {isFilterOpen && (
        <div className="job-filter-content open" style={{ marginTop: '10px' }}>
          {Object.entries(POSITION_CATEGORIES).map(([category, data]) => {
            const categoryKey = category as PositionCategoryKey;
            const isAllSelected = data.roles.every((r) =>
              selectedRoles.includes(r.value)
            );

            return (
              <div key={categoryKey} className="filter-category" style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '1em', fontWeight: 'bold' }}>{category}</h3>

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
