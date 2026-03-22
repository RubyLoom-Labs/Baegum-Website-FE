import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import NotFound from './pages/NotFound'

import ClothingPage from "./pages/Clothing/ClothingPage";
import CategoryPage from "./pages/Category/CategoryPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-light">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />

            <Route path="/clothing" element={<ClothingPage />} /> 
            <Route path="/:category" element={<CategoryPage />} />
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
