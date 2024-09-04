interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => (
  <div className="mt-4 flex justify-center space-x-2">
    {/* Previous Page Button */}
    <a
      href={`/?page=${currentPage - 1}`}
      className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
      aria-disabled={currentPage === 1}
    >
      Previous
    </a>

    {/* Page Numbers */}
    {Array.from({ length: totalPages }, (_, i) => (
      <a
        key={i + 1}
        href={`/?page=${i + 1}`}
        className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
      >
        {i + 1}
      </a>
    ))}

    {/* Next Page Button */}
    <a
      href={`/?page=${currentPage + 1}`}
      className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
      aria-disabled={currentPage === totalPages}
    >
      Next
    </a>
  </div>
);

export default Pagination;
