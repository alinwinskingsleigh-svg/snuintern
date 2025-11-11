// src/pages/LandingPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import JobFilter from '../components/JobFilter';
import LoginRequiredModal from '../components/LoginRequiredModal';
import Pagination from '../components/Pagination';
import PostCard from '../components/PostCard';
import TopFilters from '../components/TopFilters';
import { useJobFilter } from '../hooks/useJobFilter';
import { usePosts } from '../hooks/usePosts';

const LandingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = parseInt(searchParams.get('page') || '0', 10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookmarkRefreshKey, setBookmarkRefreshKey] = useState(0);

  const [isFilterOpen, setIsFilterOpen] = useState(true);
  // ✅ 필터 열림/닫힘 상태 추가
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const toggleFilter = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());
    if (!currentParams.page) {
      navigate(`?page=0`, { replace: true });
    }
  }, [searchParams, navigate]);

  const setPage = useCallback(
    (newPage: number) => {
      const currentParams = Object.fromEntries(searchParams.entries());
      setSearchParams({ ...currentParams, page: String(newPage) });
    },
    [searchParams, setSearchParams]
  );

  const {
    selectedRoles,
    selectedDomains,
    isActive,
    order,
    isStatusChanged,
    isDomainsChanged,
    isSortChanged,
    handleRoleToggle,
    handleCategoryAllToggle,
    handleDomainToggle,
    handleIsActiveChange,
    handleOrderChange,
    handleResetFilters,
  } = useJobFilter();

  const { posts, paginator, loading, error } = usePosts(
    selectedRoles,
    selectedDomains,
    isActive,
    order,
    page,
    bookmarkRefreshKey
  );

  const refreshPosts = useCallback(() => {
    setBookmarkRefreshKey((prev) => prev + 1);
  }, []);

  if (loading) {
    return (
      <div className="loading" style={{ textAlign: 'center', padding: '50px' }}>
        채용 공고를 불러오는 중...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>채용 공고</h1>

      {/* ✅ 필터 전체를 세로로 배치 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 직군 필터 영역 (윗부분으로 이동됨) */}
        <JobFilter
          selectedRoles={selectedRoles}
          onRoleToggle={handleRoleToggle}
          onCategoryAllToggle={handleCategoryAllToggle}
          isFilterOpen={isFilterOpen}
          onToggleFilter={toggleFilter}
        />

        {/* 모집상태 / 업종 / 최신순 */}
        <TopFilters
          selectedDomains={selectedDomains}
          onDomainToggle={handleDomainToggle}
          isActive={isActive}
          onIsActiveChange={handleIsActiveChange}
          order={order}
          onOrderChange={handleOrderChange}
          onResetFilters={handleResetFilters}
          isStatusChanged={isStatusChanged}
          isDomainsChanged={isDomainsChanged}
          isSortChanged={isSortChanged}
        />

        {/* 채용 공고 리스트 */}
        {error && (
          <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
            {error}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '20px',
            marginTop: '20px',
          }}
        >
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              refreshPosts={refreshPosts}
              onLoginRequired={() => setIsModalOpen(true)}
            />
          ))}
        </div>

        <Pagination
          paginator={paginator}
          currentPage={page}
          setPage={setPage}
        />
      </div>

      {isModalOpen && (
        <LoginRequiredModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default LandingPage;
