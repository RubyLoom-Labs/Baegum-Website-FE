import { Link } from 'react-router-dom'

export default function CTASection() {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-8">
          Explore our platform and discover what we can do for you.
        </p>
        <Link
          to="/about"
          className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Learn More
        </Link>
      </div>
    </section>
  )
}
