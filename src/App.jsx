import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from "@/context/CartContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { AuthProvider } from "@/context/AuthContext";

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

import ProfilePage from "./pages/Profile/ProfilePage";
import CartDrawer from "@/components/Cart/CartDrawer"
import WishlistDrawer from "@/components/Wishlist/WishlistDrawer"
import AuthModal from "@/components/Auth/AuthModal";

import Home from './pages/Home/Home'
import About from './pages/About/About'
import NotFound from './pages/NotFound'
import ClothingPage from "./pages/Clothing/ClothingPage"
import CategoryPage from "./pages/Category/CategoryPage"
import ProductPage from "./pages/Product/ProductPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="flex flex-col min-h-screen bg-light">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/"          element={<Home />} />
                  <Route path="/about"     element={<About />} />
                  <Route path="/clothing"  element={<ClothingPage />} />
                  <Route path="/:category" element={<CategoryPage />} />
                  <Route path="/products/:category/:id" element={<ProductPage />} />
                  <Route path="*"          element={<NotFound />} />  {/* ← * not /not-found */}
                  import ProfilePage from "./pages/Profile/ProfilePage";
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </main>
              <Footer />
              <CartDrawer />
              <WishlistDrawer />
              <AuthModal />        {/* ← move here, inside all providers */}
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App