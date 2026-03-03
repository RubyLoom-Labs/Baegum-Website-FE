export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-dark mb-12">
          Why Choose Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Fast & Modern',
              description: 'Built with React and Vite for optimal performance',
              icon: '⚡',
            },
            {
              title: 'Responsive Design',
              description: 'Looks perfect on all devices with Tailwind CSS',
              icon: '📱',
            },
            {
              title: 'Developer Friendly',
              description: 'Clean architecture and well-organized code',
              icon: '💻',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-dark mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
