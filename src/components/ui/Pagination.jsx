// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const ChevronLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
    </svg>
)

const ChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
)

function buildPages(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = [];

    if (current <= 4) {
        // Near start: 1 2 3 4 5 ... last
        for (let i = 1; i <= Math.min(5, total); i++) pages.push(i);
        if (total > 6) pages.push('...');
        pages.push(total);
    } else if (current >= total - 3) {
        // Near end: 1 ... last-4 last-3 last-2 last-1 last
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
        // Middle: 1 ... cur-1 cur cur+1 ... last
        pages.push(1);
        pages.push('...');
        pages.push(current - 1);
        pages.push(current);
        pages.push(current + 1);
        pages.push('...');
        pages.push(total);
    }

    return pages;
}

export default function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) {
    const pages = buildPages(currentPage, totalPages);
    const showingStart = (currentPage - 1) * itemsPerPage + 1;
    const showingEnd = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-center mt-10 pt-6 border-t border-gray-100">

            {/* ── Page controls ──────────────────────────────────────── */}
            <div className="flex items-center gap-1">

                {/* Previous */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-[13px] font-light
                     text-[#1a1a1a] hover:bg-gray-100 active:bg-gray-200
                     transition-colors disabled:opacity-30 disabled:cursor-not-allowed
                     rounded-sm"
                    aria-label="Previous page"
                >
                    <ChevronLeft />
                    <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {pages.map((page, i) =>
                        page === '...' ? (
                            <span key={`dots-${i}`}
                                className="w-9 h-9 flex items-center justify-center
                           text-[13px] text-gray-400 font-light select-none">
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className="w-9 h-9 flex items-center justify-center rounded-sm
                           text-[13px] font-light transition-all duration-200"
                                style={{
                                    backgroundColor: page === currentPage ? '#1a1a1a' : 'transparent',
                                    color: page === currentPage ? '#ffffff' : '#1a1a1a',
                                    fontWeight: page === currentPage ? '500' : '300',
                                }}
                                onMouseEnter={(e) => {
                                    if (page !== currentPage) e.currentTarget.style.backgroundColor = '#f3f4f6';
                                }}
                                onMouseLeave={(e) => {
                                    if (page !== currentPage) e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                                aria-label={`Page ${page}`}
                                aria-current={page === currentPage ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>

                {/* Next */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-[13px] font-light
                     text-[#1a1a1a] hover:bg-gray-100 active:bg-gray-200
                     transition-colors disabled:opacity-30 disabled:cursor-not-allowed
                     rounded-sm"
                    aria-label="Next page"
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight />
                </button>
            </div>

        </div>
    );
}
