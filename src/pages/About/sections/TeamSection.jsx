export default function TeamSection() {
  return (
    <section className="py-16 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-dark text-center mb-12">
          Why Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Performance',
              description: 'Lightning-fast load times with optimized build processes',
            },
            {
              title: 'Scalability',
              description: 'Architecture designed to grow with your needs',
            },
            {
              title: 'Maintainability',
              description: 'Clean, well-organized code that is easy to maintain',
            },
          ].map((reason, index) => (
            <div key={index} className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-dark mb-3">{reason.title}</h3>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
