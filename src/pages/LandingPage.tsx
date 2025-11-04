// src/pages/LandingPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useJobFilter } from '../hooks/useJobFilter';
import { usePosts } from '../hooks/usePosts';
// TODO: PostCard, TopFilters, JobFilter, Pagination 컴포넌트를 생성하고 임포트해야 합니다.
import JobFilter from '../components/JobFilter'; 
import TopFilters from '../components/TopFilters';
import PostCard from '../components/PostCard'; // 찜하기 로직 포함 컴포넌트
import Pagination from '../components/Pagination';
import LoginRequiredModal from '../components/LoginRequiredModal';


// PostList.jsx의 로직을 따라 URL에서 페이지를 읽고 기본값을 설정합니다.
const LandingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // 예시 코드(PostIndex.jsx)와 같이 URL에서 페이지를 읽고 기본값 0을 설정
  const page = parseInt(searchParams.get("page") || "0", 10);
  
  // 찜하기 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 페이지 파라미터가 없으면 URL에 추가 (예시 코드 로직)
  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());
    if (!currentParams.page) {
      navigate(`?page=0`, { replace: true });
    }
  }, [searchParams, navigate]);

  // 페이지 변경 핸들러
  const setPage = useCallback((newPage: number) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    // 페이지 번호는 string으로 URL에 저장
    setSearchParams({ ...currentParams, page: String(newPage) });
  }, [searchParams, setSearchParams]);

  // 필터 상태 훅 사용
  const {
    selectedRoles,
    selectedDomains,
    isActive,
    order,
    isStatusChanged,
    isDomainsChanged,
    isSortChanged,
    isRolesChanged,
    handleRoleToggle,
    handleCategoryAllToggle,
    handleDomainToggle,
    handleIsActiveChange,
    handleOrderChange,
    handleResetFilters,
  } = useJobFilter();

  // 포스트 데이터 훅 사용
  const { posts, paginator, loading, error } = usePosts(
    selectedRoles, 
    selectedDomains, 
    isActive, 
    order, 
    page // URL에서 읽은 페이지 번호를 전달
  );
  
  // 찜하기/찜하기 해제 후 데이터 새로고침을 위한 임시 함수 (실제는 usePosts 내부에서 처리될 수도 있습니다)
  // 여기서는 단순히 usePosts의 의존성을 강제로 업데이트할 수 없으므로,
  // 찜하기 상태가 변경되었음을 알리는 상태를 추가하여 usePosts를 다시 실행하도록 합니다.
  const [bookmarkRefreshKey, setBookmarkRefreshKey] = useState(0); 
  const refreshPosts = useCallback(() => {
    setBookmarkRefreshKey(prev => prev + 1);
  }, []);
  
  // TODO: usePosts 훅을 수정하여 bookmarkRefreshKey를 의존성 배열에 추가해야 합니다.
  // (현재 usePosts 코드는 이 상태를 받지 않으므로, 이 부분을 수정해야 완벽하게 작동합니다.)
  // 임시로 PostCard에서 찜하기 성공 시 refreshPosts를 호출한다고 가정합니다.

  if (loading) {
    return <div className="loading" style={{textAlign: 'center', padding: '50px'}}>채용 공고를 불러오는 중...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>채용 공고</h1>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* 1. 직군 필터 (좌측) */}
        {/* JobFilter 컴포넌트를 사용합니다. (아직 생성 안 됨) */}
        <div style={{ width: '250px' }}>
            <JobFilter
              selectedRoles={selectedRoles}
              onRoleToggle={handleRoleToggle}
              onCategoryAllToggle={handleCategoryAllToggle}
              isFilterOpen={true} // 임시: 항상 열림
            />
        </div>

        {/* 2. 메인 컨텐츠 (우측) */}
        <div style={{ flexGrow: 1 }}>
          {/* 상단 필터 */}
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
          
          {/* 공고 목록 그리드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '20px' }}>
            {posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onBookmarkClick={() => { /* 찜하기 핸들러 */ }}
                onLoginRequired={() => setIsModalOpen(true)} // 로그인 유도 모달
                // refreshPosts={refreshPosts} // 찜하기 후 새로고침 (TODO)
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          <Pagination
            paginator={paginator}
            currentPage={page}
            setPage={setPage}
          />
        </div>
      </div>
      
      {/* 찜하기 시 로그인 유도 모달 (스펙) */}
      {isModalOpen && <LoginRequiredModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default LandingPage;