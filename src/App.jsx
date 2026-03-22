import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from "@/context/CartContext"
import { WishlistProvider } from "@/context/WishlistContext"

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import CartDrawer from "@/components/Cart/CartDrawer"
import WishlistDrawer from "@/components/Wishlist/WishlistDrawer"

import Home from './pages/Home/Home'
import About from './pages/About/About'
import NotFound from './pages/NotFound'
import ClothingPage from "./pages/Clothing/ClothingPage"
import CategoryPage from "./pages/Category/CategoryPage"

function App() {
  return (
    <Router>
      <CartProvider>              {/* ← wrap everything */}
        <WishlistProvider>        {/* ← wrap everything */}
          <div className="flex flex-col min-h-screen bg-light">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/"         element={<Home />} />
                <Route path="/about"    element={<About />} />
                <Route path="/clothing" element={<ClothingPage />} />
                <Route path="/:category" element={<CategoryPage />} />
                <Route path="/not-found"         element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <CartDrawer />        {/* ← outside Routes */}
            <WishlistDrawer />    {/* ← outside Routes */}
          </div>
        </WishlistProvider>
      </CartProvider>
    </Router>
  )
}

export default App