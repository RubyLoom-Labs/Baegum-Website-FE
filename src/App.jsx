import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { AuthProvider } from '@/context/AuthContext'

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import CartDrawer from '@/components/Cart/CartDrawer'
import WishlistDrawer from '@/components/Wishlist/WishlistDrawer'
import AuthModal from '@/components/Auth/AuthModal'

// Pages
import Home from './pages/Home/Home'
import About from './pages/About/About'
import NotFound from './pages/NotFound'
import ProfilePage from './pages/Profile/ProfilePage'

// Category pages — each in its own folder
import ClothingPage from './pages/Clothing/ClothingPage'
import MakeupPage from './pages/Makeup/MakeupPage'
import FragrancePage from './pages/Fragrance/FragrancePage'
import BathBodyPage from './pages/BathBody/BathBodyPage'
import SkincarePage from './pages/Skincare/SkincarePage'
import BrandsPage from './pages/Brands/BrandsPage'
import BestSellersPage from './pages/BestSellers/BestSellersPage'

// Product detail pages
import ProductPage from './pages/Product/ProductPage'

//Order flow pages
import CheckoutPage from './pages/Checkout/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmation/OrderConfirmationPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  {/* Main */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/profile" element={<ProfilePage />} />

                  {/* Category pages */}
                  <Route path="/clothing" element={<ClothingPage />} />
                  <Route path="/makeup" element={<MakeupPage />} />
                  <Route path="/fragrance" element={<FragrancePage />} />
                  <Route path="/bath-body" element={<BathBodyPage />} />
                  <Route path="/skincare" element={<SkincarePage />} />
                  <Route path="/brands" element={<BrandsPage />} />
                  <Route path="/best-sellers" element={<BestSellersPage />} />

                  {/* Product detail — /products/:category/:id */}
                  <Route path="/products/:category/:id" element={<ProductPage />} />

                  {/* Order flow */}
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                  <Route path="/order-details" element={<OrderConfirmationPage />} />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <CartDrawer />
              <WishlistDrawer />
              <AuthModal />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App