"use client"
import { useSearchParams, usePathname } from 'next/navigation';

/**
 * PaginationProps interface defines the configuration options for the Pagination component
 */
interface PaginationProps {
  /** Current active page number (1-based indexing) */
  currentPage: number;

  /** Total number of pages available */
  totalPages: number;

  /** Optional base URL for pagination links. Defaults to current pathname if not provided */
  baseUrl?: string;

  /** Array of URL parameter names to exclude when building pagination URLs */
  excludeParams?: string[];

  /** Additional URL parameters to always include in pagination links */
  additionalParams?: Record<string, string>;
}

/**
 * Pagination Component
 * 
 * A fully reusable and dynamic pagination component that preserves URL state
 * and works with any page or API endpoint. Features include:
 * 
 * - Automatic URL parameter preservation
 * - Smart page number display with ellipsis for large page counts
 * - Keyboard navigation support
 * - Accessibility features (ARIA attributes)
 * - Responsive design with hover/focus effects
 * - Type-safe parameter handling
 * 
 * @example
 * // Basic usage
 * <Pagination currentPage={3} totalPages={10} />
 * 
 * @example
 * // With additional parameters
 * <Pagination
 *   currentPage={page}
 *   totalPages={totalPages}
 *   additionalParams={{
 *     search: searchTerm,
 *     category: selectedCategory,
 *     sort: 'name'
 *   }}
 * />
 * 
 * @example
 * // Excluding certain parameters
 * <Pagination
 *   currentPage={page}
 *   totalPages={totalPages}
 *   excludeParams={['temp_filter']}
 *   baseUrl="/custom/path"
 * />
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  baseUrl,
  excludeParams = [],
  additionalParams = {},
}: PaginationProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Ensure currentPage and totalPages are always numbers and at least 1
  // This prevents errors from invalid props and provides sensible defaults
  const safeCurrentPage = Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1;
  const safeTotalPages = Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1;

  /**
   * Build URL with preserved search parameters
   * 
   * This function intelligently constructs pagination URLs by:
   * 1. Preserving existing URL parameters (except excluded ones)
   * 2. Adding any additional parameters specified
   * 3. Setting the page parameter
   * 4. Using the provided baseUrl or current pathname
   * 
   * @param page - The target page number for the URL
   * @returns Complete URL string with all parameters
   */
  const buildUrl = (page: number) => {
    const params = new URLSearchParams();

    // Add all existing search parameters except excluded ones and 'page'
    // This preserves filters, search terms, sorting, etc.
    searchParams.forEach((value, key) => {
      if (!excludeParams.includes(key) && key !== 'page') {
        params.set(key, value);
      }
    });

    // Add additional parameters (only if they have values)
    // This allows components to inject their own parameters
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    // Set the target page parameter
    params.set('page', page.toString());

    // Build the final URL using baseUrl or current pathname
    const queryString = params.toString();
    const base = baseUrl || pathname;
    return `${base}${queryString ? `?${queryString}` : ''}`;
  };

  /**
   * Generate smart page number display with ellipsis
   * 
   * This function creates an intelligent page number array that:
   * - Always shows first and last pages
   * - Uses ellipsis (...) for gaps
   * - Shows current page and surrounding pages
   * - Adapts based on current position and total pages
   * 
   * Algorithm:
   * - If 7 or fewer pages: show all pages
   * - If near start (≤4): show first 5 pages + ellipsis + last
   * - If near end (≥total-3): show first + ellipsis + last 5 pages  
   * - Otherwise: show first + ellipsis + current±2 + ellipsis + last
   * 
   * @returns Array of page numbers and ellipsis strings
   */
  const getPageNumbers = () => {
    const pages = [];
    if (!Number.isFinite(safeTotalPages) || safeTotalPages < 1) return [1];

    // Always display the first page
    pages.push(1);

    // If totalPages is 7 or less, display all pages (simple case)
    if (safeTotalPages <= 7) {
      for (let i = 2; i < safeTotalPages; i++) {
        pages.push(i);
      }
      if (safeTotalPages > 1) pages.push(safeTotalPages);
    } else {
      // Complex pagination logic for many pages

      // If currentPage is near the start, display first few pages
      if (safeCurrentPage <= 4) {
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(safeTotalPages);
      }
      // If currentPage is near the end, display last few pages
      else if (safeCurrentPage >= safeTotalPages - 3) {
        pages.push('...');
        for (let i = safeTotalPages - 4; i < safeTotalPages; i++) {
          pages.push(i);
        }
        pages.push(safeTotalPages);
      }
      // Otherwise, display current page in the middle with context
      else {
        pages.push('...');
        for (let i = safeCurrentPage - 2; i <= safeCurrentPage + 2; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(safeTotalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {/* Previous Button - Disabled when on first page */}
      <a
        href={buildUrl(safeCurrentPage - 1)}
        className={`px-3 py-2 rounded-md border transition-colors duration-150 ${safeCurrentPage === 1
          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600'
          }`}
        aria-disabled={safeCurrentPage === 1}
        tabIndex={safeCurrentPage === 1 ? -1 : 0}
      >
        « Prev
      </a>

      {/* Page Numbers - Dynamic list with ellipsis for large page counts */}
      {pageNumbers.map((page, index) => (
        <span key={index}>
          {typeof page === 'number' ? (
            // Clickable page number
            <a
              href={buildUrl(page)}
              className={`px-3 py-2 rounded-md border transition-colors duration-150 mx-0.5 ${safeCurrentPage === page
                ? 'bg-blue-600 text-white border-blue-600 font-bold shadow' // Active page styling
                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600' // Inactive page styling
                }`}
            >
              {String(page)}
            </a>
          ) : (
            // Ellipsis indicator for skipped pages
            <span className="px-3 py-2 text-gray-400 select-none">…</span>
          )}
        </span>
      ))}

      {/* Next Button - Disabled when on last page */}
      <a
        href={buildUrl(safeCurrentPage + 1)}
        className={`px-3 py-2 rounded-md border transition-colors duration-150 ${safeCurrentPage === safeTotalPages
          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600'
          }`}
        aria-disabled={safeCurrentPage === safeTotalPages}
        tabIndex={safeCurrentPage === safeTotalPages ? -1 : 0}
      >
        Next »
      </a>
    </div>
  );
};

/**
 * Export the Pagination component as default
 * 
 * This component is designed to be imported and used throughout the application
 * wherever pagination functionality is needed, providing consistent UI/UX
 * and maintaining URL state across different pages and features.
 */
export default Pagination;
