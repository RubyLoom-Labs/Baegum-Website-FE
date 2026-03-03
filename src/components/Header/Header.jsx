import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-dark text-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary hover:text-secondary transition">
            Baegum
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8">
            <Link
              to="/"
              className="hover:text-primary transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hover:text-primary transition duration-300"
            >
              About
            </Link>
            <a
              href="#contact"
              className="hover:text-primary transition duration-300"
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className="w-6 h-0.5 bg-white"></span>
            <span className="w-6 h-0.5 bg-white"></span>
            <span className="w-6 h-0.5 bg-white"></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-4 pb-4">
            <Link
              to="/"
              className="hover:text-primary transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hover:text-primary transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <a
              href="#contact"
              className="hover:text-primary transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
          </div>
        )}
      </nav>
    </header>
  )
}
