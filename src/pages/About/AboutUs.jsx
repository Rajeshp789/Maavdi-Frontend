import './AboutUs.css'

function AboutUs() {
  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12 px-4 rounded-lg mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">About Maavdi Design</h1>
        <p className="text-xl">Crafting Excellence Since Day One</p>
      </div>

      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-lg shadow">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Maavdi Design was founded with a simple vision: to bring high-quality, beautifully 
              designed products to everyone. We believe that great design should be accessible, 
              affordable, and inspire joy in everyday life.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Since our inception, we've grown from a small startup to a trusted brand serving 
              thousands of satisfied customers worldwide. Our commitment to quality, innovation, 
              and customer satisfaction remains unwavering.
            </p>
          </div>
          <div>
            <img src="https://via.placeholder.com/400x300?text=Our+Story" alt="Our Story" className="w-full rounded-lg shadow-lg" />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-blue-500 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To provide innovative, high-quality products that enhance the lives of our customers 
              while maintaining sustainable and ethical business practices.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-blue-500 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To become the leading global design brand known for excellence, creativity, 
              and customer-centric values.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-blue-500 mb-4">Our Values</h3>
            <p className="text-gray-600 leading-relaxed">
              Quality, Innovation, Integrity, Sustainability, and Customer Satisfaction are 
              at the core of everything we do.
            </p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Team</h2>
        <p className="text-gray-600 text-lg mb-8">Meet the talented people behind Maavdi Design</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition">
            <img src="https://via.placeholder.com/150?text=Designer" alt="Team Member" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
            <h3 className="font-bold text-gray-800 mb-2">Creative Director</h3>
            <p className="text-gray-600 text-sm">Leading our design vision with innovation and passion</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition">
            <img src="https://via.placeholder.com/150?text=Developer" alt="Team Member" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
            <h3 className="font-bold text-gray-800 mb-2">Development Lead</h3>
            <p className="text-gray-600 text-sm">Building robust solutions with cutting-edge technology</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition">
            <img src="https://via.placeholder.com/150?text=Manager" alt="Team Member" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
            <h3 className="font-bold text-gray-800 mb-2">Business Manager</h3>
            <p className="text-gray-600 text-sm">Driving growth and customer relationships</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition">
            <img src="https://via.placeholder.com/150?text=Support" alt="Team Member" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
            <h3 className="font-bold text-gray-800 mb-2">Customer Support</h3>
            <p className="text-gray-600 text-sm">Ensuring exceptional service and satisfaction</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs
