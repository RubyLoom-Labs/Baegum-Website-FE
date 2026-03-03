export default function HeroSection() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-dark to-dark/80 text-white flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-secondary rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Welcome to <span className="text-primary">Baegum</span>
        </h1>

        <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          A modern, fast, and responsive website built with React and Vite. Experience
          the future of web development.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition transform hover:scale-105">
            Get Started
          </button>
          <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition transform hover:scale-105">
            Learn More
          </button>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            { label: 'React 18', value: 'Latest' },
            { label: 'Vite', value: 'Ultra-Fast' },
            { label: 'Tailwind CSS', value: 'Beautiful' },
          ].map((item, index) => (
            <div key={index} className="p-6 bg-dark/50 rounded-lg backdrop-blur">
              <div className="text-sm text-gray-400 mb-2">{item.label}</div>
              <div className="text-2xl font-bold text-primary">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
