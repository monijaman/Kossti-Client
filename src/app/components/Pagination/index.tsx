interface PaginationProps {
  category: string;
  currentPage: number;
  totalPages: number;
  selectedBrands: string; // Add this parameter
}

const Pagination = ({ category, currentPage, totalPages, selectedBrands }: PaginationProps) => {

  // Function to get category from the URL

  const getPageNumbers = () => {
    const pages = [];

    // Always display the first page
    pages.push(1);

    // If totalPages is 7 or less, display all pages
    if (totalPages <= 7) {
      for (let i = 2; i < totalPages; i++) {
        pages.push(i);
      }
      pages.push(totalPages);
    } else {
      // If currentPage is near the start, display first few pages
      if (currentPage <= 4) {
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
      // If currentPage is near the end, display last few pages
      else if (currentPage >= totalPages - 3) {
        pages.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      }
      // Otherwise, display current page in the middle
      else {
        pages.push('...');
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-4 flex justify-center items-center space-x-2">
      {/* Previous Button */}
      <a
        href={`?page=${currentPage - 1}${category ? `&category=${category}` : ''}${selectedBrands ? `&brand=${selectedBrands}` : ''}`}
        className={`px-3 py-1 rounded-full border ${currentPage === 1 ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-600 border-gray-300'}`}
        aria-disabled={currentPage === 1}
      >
        &laquo; Previous
      </a>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => (
        <span key={index}>
          {page === '...' ? (
            <span className="px-3 py-1">...</span>
          ) : (
            <a
              href={`?page=${page}${category ? `&category=${category}` : ''}${selectedBrands ? `&brand=${selectedBrands}` : ''}`}
              className={`px-3 py-1 rounded-full border ${currentPage === page ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-white text-blue-600 border-gray-300'}`}
            >
              {page}
            </a>
          )}
        </span>
      ))}

      {/* Next Button */}
      <a
        href={`?page=${currentPage + 1}${category ? `&category=${category}` : ''}${selectedBrands ? `&brand=${selectedBrands}` : ''}`}
        className={`px-3 py-1 rounded-full border ${currentPage === totalPages ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-600 border-gray-300'}`}
        aria-disabled={currentPage === totalPages}
      >
        Next &raquo;
      </a>
    </div>
  );
};

export default Pagination;
