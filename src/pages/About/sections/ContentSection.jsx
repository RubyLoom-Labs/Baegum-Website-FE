export default function ContentSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-dark mb-6">Our Story</h2>
          <p className="text-gray-600 mb-6">
            Baegum was created to demonstrate modern web development practices using
            the latest technologies. We believe in building fast, responsive, and
            user-friendly websites that provide excellent user experiences.
          </p>

          <h2 className="text-3xl font-bold text-dark mb-6 mt-12">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            To create beautiful, performant, and accessible web applications that help
            businesses and individuals achieve their goals online.
          </p>

          <h2 className="text-3xl font-bold text-dark mb-6 mt-12">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            {[
              {
                name: 'React',
                description: 'A JavaScript library for building user interfaces',
              },
              {
                name: 'Vite',
                description: 'Next generation frontend tooling',
              },
              {
                name: 'Tailwind CSS',
                description: 'Utility-first CSS framework',
              },
              {
                name: 'React Router',
                description: 'Declarative routing for React',
              },
            ].map((tech, index) => (
              <div key={index} className="p-6 bg-light border border-gray-200 rounded-lg">
                <h3 className="font-bold text-lg text-dark mb-2">{tech.name}</h3>
                <p className="text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
