import React from 'react';
import { Button } from '@/components/ui/button';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const maxPagesToShow = 5; // Number of page buttons to show (e.g., 1, 2, 3, 4, 5 or ..., 3, 4, 5, 6, ... )
  let startPage, endPage;

  if (totalPages <= maxPagesToShow) {
    // Less than or equal to maxPagesToShow pages, so show all
    startPage = 1;
    endPage = totalPages;
  } else {
    // More than maxPagesToShow pages, so calculate start and end pages
    const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
    const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
    if (currentPage <= maxPagesBeforeCurrentPage) {
      // Near the start
      startPage = 1;
      endPage = maxPagesToShow;
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      // Near the end
      startPage = totalPages - maxPagesToShow + 1;
      endPage = totalPages;
    } else {
      // Somewhere in the middle
      startPage = currentPage - maxPagesBeforeCurrentPage;
      endPage = currentPage + maxPagesAfterCurrentPage;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handleFirstPage = () => onPageChange(1);
  const handlePreviousPage = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNextPage = () => onPageChange(Math.min(totalPages, currentPage + 1));
  const handleLastPage = () => onPageChange(totalPages);

  return (
    <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-12">
      <Button
        variant="outline"
        onClick={handleFirstPage}
        disabled={currentPage === 1}
        size="sm"
        className="hidden sm:inline-flex"
      >
        Primeira
      </Button>
      <Button
        variant="outline"
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        size="sm"
      >
        Anterior
      </Button>

      {startPage > 1 && (
        <>
          <Button variant="outline" onClick={() => onPageChange(1)} size="sm" className="hidden md:inline-flex">
            1
          </Button>
          {startPage > 2 && <span className="text-muted-foreground px-1.5 hidden md:inline-block">...</span>}
        </>
      )}

      {pageNumbers.map(number => (
        <Button
          key={number}
          variant={currentPage === number ? "default" : "outline"}
          onClick={() => onPageChange(number)}
          size="sm"
          className={currentPage === number ? "bg-primary text-primary-foreground" : ""}
        >
          {number}
        </Button>
      ))}

      {endPage < totalPages && (
        <>
         {endPage < totalPages -1 && <span className="text-muted-foreground px-1.5 hidden md:inline-block">...</span>}
          <Button variant="outline" onClick={() => onPageChange(totalPages)} size="sm" className="hidden md:inline-flex">
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        size="sm"
      >
        Próxima
      </Button>
      <Button
        variant="outline"
        onClick={handleLastPage}
        disabled={currentPage === totalPages}
        size="sm"
        className="hidden sm:inline-flex"
      >
        Última
      </Button>
    </div>
  );
};

export default Pagination;