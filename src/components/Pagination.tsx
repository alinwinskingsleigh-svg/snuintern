// src/components/Pagination.tsx
import React from "react";
import type { Paginator } from "../types/post";

interface PaginationProps {
  paginator: Paginator;
  currentPage: number; // 0부터 시작하는 페이지 번호
  setPage: (newPage: number) => void;
}

const PAGE_GROUP_SIZE = 5;

const Pagination: React.FC<PaginationProps> = ({
  paginator,
  currentPage,
  setPage,
}) => {
  if (!paginator || paginator.lastPage <= 1) {
    return null;
  }

  // 예시 코드(PostIndex.jsx) 로직: 5개씩 페이지 그룹화
  const startPage = Math.floor(currentPage / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE;
  // lastPage는 총 페이지 수 (1부터 시작), 예시 코드에서는 lastPage - 1이 마지막 인덱스
  const maxPageIndex = paginator.lastPage - 1;

  const hasPrev = currentPage > 0;
  const hasNext = currentPage < maxPageIndex;

  // 5개 단위로 페이지 번호 렌더링
  const pageNumbers = Array.from({ length: PAGE_GROUP_SIZE }, (_, i) => {
    const pageNum = startPage + i;
    const isVisible = pageNum <= maxPageIndex;

    if (!isVisible) return null;

    return (
      <button
        key={pageNum}
        onClick={() => setPage(pageNum)}
        // TODO: CSS 파일이 없으므로 인라인 스타일로 임시 적용
        style={{
          margin: "0 5px",
          padding: "5px 10px",
          border:
            currentPage === pageNum ? "1px solid #007bff" : "1px solid #ddd",
          backgroundColor: currentPage === pageNum ? "#007bff" : "white",
          color: currentPage === pageNum ? "white" : "black",
          cursor: "pointer",
        }}
      >
        {pageNum + 1}
      </button>
    );
  }).filter(Boolean);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
    >
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => hasPrev && setPage(currentPage - 1)}
        disabled={!hasPrev}
        style={{ marginRight: "10px" }}
      >
        &lt; 이전
      </button>

      {/* 페이지 번호들 */}
      {pageNumbers}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => hasNext && setPage(currentPage + 1)}
        disabled={!hasNext}
        style={{ marginLeft: "10px" }}
      >
        다음 &gt;
      </button>
    </div>
  );
};

export default Pagination;
