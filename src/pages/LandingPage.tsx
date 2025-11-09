// src/pages/LandingPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useJobFilter } from '../hooks/useJobFilter';
import { usePosts } from '../hooks/usePosts';
import JobFilter from '../components/JobFilter'; 
import TopFilters from '../components/TopFilters';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import LoginRequiredModal from '../components/LoginRequiredModal';

const LandingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const page = parseInt(searchParams.get("page") || "0", 10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ✅ 찜하기 새로고침을 위한 키 추가
  const [bookmarkRefreshKey, setBookmarkRefreshKey] = useState(0);

  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());
    if (!currentParams.page) {
      navigate(`?page=0`, { replace: true });
    }
  }, [searchParams, navigate]);

  const setPage = useCallback((newPage: number) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, page: String(newPage) });
  }, [searchParams, setSearchParams]);

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

  // ✅ bookmarkRefreshKey를 usePosts에 전달
  const { posts, paginator, loading, error } = usePosts(
    selectedRoles, 
    selectedDomains, 
    isActive, 
    order, 
    page,
    bookmarkRefreshKey // ✅ 추가
  );
  
  // ✅ 찜하기 후 데이터 새로고침 함수
  const refreshPosts = useCallback(() => {
    setBookmarkRefreshKey(prev => prev + 1);
  }, []);

  if (loading) {
    return <div className="loading" style={{textAlign: 'center', padding: '50px'}}>채용 공고를 불러오는 중...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>채용 공고</h1>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ width: '250px' }}>
          <JobFilter
            selectedRoles={selectedRoles}
            onRoleToggle={handleRoleToggle}
            onCategoryAllToggle={handleCategoryAllToggle}
            isFilterOpen={true}
          />
        </div>

        <div style={{ flexGrow: 1 }}>
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
          
          {error && <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>}
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '20px' }}>
            {posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                refreshPosts={refreshPosts} // ✅ refreshPosts 전달
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
      </div>
      
      {isModalOpen && <LoginRequiredModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default LandingPage;