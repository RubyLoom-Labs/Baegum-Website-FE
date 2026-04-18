import { useEffect, useState } from 'react'
import ProductCard from '@/components/ui/ProductCard'
import FilterSidebar from './components/FilterSidebar'
import Pagination from '@/components/ui/Pagination'
import { getProducts } from '@/services/product'
import placeholder from '@/assets/products/bath-body/p1.png'

const ITEMS_PER_PAGE = 12

const getProductImage = (apiProduct) => {
  if (!apiProduct) return placeholder
  
  // Try to get image from photos array (prioritize primary photo)
  const photos = apiProduct.photos || []
  let photoPath = null
  
  if (photos.length > 0) {
    const primaryPhoto = photos.find(p => p.is_primary)
    photoPath = primaryPhoto?.photo_path || photos[0]?.photo_path
  }
  
  if (photoPath) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const cleanPath = photoPath.startsWith('/') ? photoPath.substring(1) : photoPath
    return `${apiUrl}/storage/${cleanPath}`
  }
  
  return placeholder
}

const formatProduct = (apiProduct) => {
    const variant = apiProduct.product_variants?.[2]
    return {
        id: apiProduct.id,
        image: getProductImage(apiProduct),
        name: apiProduct.name,
        description: apiProduct.sub_topic || `${apiProduct.brand?.name || ''} - ${apiProduct.product_category?.name || ''}`,
        price: `Rs.${parseFloat(apiProduct.price).toFixed(2)}` ?? 'Rs.0.00',
        href: `/products/bath-body/${apiProduct.id}`,
        is_wishlisted: apiProduct.is_wishlisted || false,
    }
}

const FilterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="10" y1="18" x2="14" y2="18" />
    </svg>
)

export default function BathBodyPage() {
    const [filterOpen, setFilterOpen] = useState(false)
    const [selectedFilters, setSelectedFilters] = useState([])
    const [products, setProducts] = useState([])
    const [totalProducts, setTotalProducts] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const filterParams = selectedFilters.reduce((acc, filter) => {
                    const [key, value] = filter.split(':')
                    acc[key] = [...(acc[key] || []), value]
                    return acc
                }, {})
                const response = await getProducts(currentPage, 4, filterParams)
                const formatted = response.data.map(formatProduct)
                setProducts(formatted)
                setTotalProducts(response.total_count || formatted.length)
                setTotalPages(response.total_pages || 1)
            } catch (error) {
                console.error('Error fetching Bath & Body products:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [currentPage, selectedFilters])

    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const toggleFilter = (key) => {
        setSelectedFilters((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        )
        setCurrentPage(1)
    }
    const clearFilters = () => { setSelectedFilters([]); setCurrentPage(1) }
    const activeCount = selectedFilters.length

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6">
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                    <button onClick={() => setFilterOpen(!filterOpen)}
                        className="flex items-center gap-2 text-[13px] text-[#1a1a1a] hover:text-gray-500 transition-colors font-medium">
                        <FilterIcon />
                        Filters
                        {activeCount > 0 && (
                            <span className="w-5 h-5 rounded-full bg-[#1a1a1a] text-white text-[10px] flex items-center justify-center font-semibold">
                                {activeCount}
                            </span>
                        )}
                    </button>
                    <p className="text-[13px] text-gray-400 font-light">{totalProducts} products</p>
                </div>

                {selectedFilters.length > 0 && (
                    <div className="hidden md:flex flex-wrap gap-2 mb-5">
                        {selectedFilters.map((key) => (
                            <button key={key} onClick={() => toggleFilter(key)}
                                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-full text-[12px] text-gray-600 hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors font-light">
                                ✕ {key.split(':')[1]}
                            </button>
                        ))}
                        <button onClick={clearFilters}
                            className="px-3 py-1.5 text-[12px] text-gray-400 hover:text-[#1a1a1a] underline underline-offset-2 transition-colors">
                            Clear all
                        </button>
                    </div>
                )}

                <div className="flex gap-6">
                    <aside className="hidden md:block flex-shrink-0 overflow-hidden"
                        style={{ width: filterOpen ? '260px' : '0px', opacity: filterOpen ? 1 : 0, transition: 'width 0.3s ease, opacity 0.3s ease', display: filterOpen ? undefined : 'none' }}>
                        <FilterSidebar category="bath-body" selected={selectedFilters} onToggle={toggleFilter} onClear={clearFilters} onClose={() => setFilterOpen(false)} />
                    </aside>

                    <div className="flex-1 min-w-0">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <p className="text-[13px] text-gray-400 font-light">Loading...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex items-center justify-center py-24">
                                <p className="text-[13px] text-gray-400 font-light">No products found.</p>
                            </div>

                        ) : (
                            <>
                                <div className={`grid gap-x-4 gap-y-8 grid-cols-2 ${filterOpen ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'}`}>
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} variant="product" />
                                    ))}
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={totalProducts}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className={`md:hidden fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${filterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setFilterOpen(false)} />
            <div className={`md:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl transition-transform duration-300 ease-out ${filterOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ maxHeight: '80vh' }}>
                <div className="p-5 h-full overflow-y-auto">
                    <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
                    <FilterSidebar category="bath-body" selected={selectedFilters} onToggle={toggleFilter} onClear={clearFilters} onClose={() => setFilterOpen(false)} isMobile />
                </div>
            </div>
        </div>
    )
}
