import { Link } from 'react-router-dom'
import products from '../../data/products'
import './Home.css'
import axios from 'axios'
import { use, useEffect } from 'react'

function Home() {
  useEffect(() => {
    GetAllProducts();
  }, []);

  const GetAllProducts = async () => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/products/`).then((res) => {
    }).catch((err) => {
      console.error(err);
    });
  }

  const categories = [
    {
      name: 'Namkeen',
      icon: '🥨',
      description: 'Crispy savory snacks',
      color: 'from-orange-400 to-red-500',
      product: products.namkeen[0]
    },
    {
      name: 'Sweet',
      icon: '🍬',
      description: 'Delicious sweets & desserts',
      color: 'from-pink-400 to-red-500',
      product: products.sweet[0]
    },
    {
      name: 'Ghee',
      icon: '🥄',
      description: 'Pure organic ghee',
      color: 'from-yellow-400 to-orange-500',
      product: products.ghee[0]
    },
    {
      name: 'Makhan',
      icon: '🧈',
      description: 'Fresh creamy butter',
      color: 'from-yellow-300 to-yellow-500',
      product: products.makhan[0]
    },
    {
      name: 'Ice Pops',
      icon: '🍦',
      description: 'Refreshing frozen treats',
      color: 'from-blue-400 to-cyan-500',
      product: products.icepops[0]
    }
  ]

  const allFeaturedProducts = [
    ...products.namkeen.slice(0, 2),
    ...products.sweet.slice(0, 2),
    products.ghee[0],
    products.makhan[0]
  ].slice(0, 6)

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative text-white py-24 px-4 rounded-2xl mb-16 overflow-hidden" style={{ backgroundImage: 'url(/image/Jalebi.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="text-center max-w-5xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">Welcome to Maavdi</h2>
          <p className="text-xl md:text-2xl mb-10 text-gray-100 font-light">Authentic Indian groceries & delicacies delivered to your doorstep</p>
          <Link to="/products" className="inline-block bg-white hover:bg-gray-100 text-indigo-600 font-bold py-4 px-10 rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">Shop Now</Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-3">Our Categories</h2>
          <p className="text-gray-600 text-lg font-medium">Explore our wide range of products</p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link to="/products" key={category.name} className={`group relative bg-gradient-to-br ${category.color} rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 p-8 text-white`}>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-3">{category.icon}</div>
                <h3 className="text-2xl font-black mb-2">{category.name}</h3>
                <p className="text-sm font-semibold opacity-90 mb-4">{category.description}</p>
                <button className="bg-white text-indigo-600 font-bold py-2 px-6 rounded-lg opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition duration-300">View All →</button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-3">Featured Products</h2>
          <p className="text-gray-600 text-lg font-medium">Best sellers from all categories</p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            products.namkeen[0],
            products.sweet[2],
            products.ghee[2],
            products.makhan[2],
            products.icepops[4],
            products.sweet[3]
          ].map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="group bg-white rounded-xl shadow-md hover:shadow-2xl transform hover:-translate-y-3 transition duration-300 overflow-hidden flex flex-col">
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                <div className="absolute top-4 right-4 bg-indigo-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                  ₹{product.price}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <span className="text-sm font-semibold text-indigo-600 mb-2">{product.category}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow leading-relaxed">{product.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-gray-500 text-sm">({product.reviews})</span>
                  </div>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition transform hover:scale-105">Add</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50 rounded-2xl px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-3">Why Choose Maavdi?</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105">
            <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-2xl">✨</div>
            <h3 className="text-xl font-black text-gray-900 mb-3">Authentic Products</h3>
            <p className="text-gray-600 leading-relaxed">100% authentic Indian groceries & handmade delicacies</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105">
            <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-2xl">💰</div>
            <h3 className="text-xl font-black text-gray-900 mb-3">Best Prices</h3>
            <p className="text-gray-600 leading-relaxed">Direct from makers - no middlemen, best value for money</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105">
            <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-2xl">🚀</div>
            <h3 className="text-xl font-black text-gray-900 mb-3">Fast Delivery</h3>
            <p className="text-gray-600 leading-relaxed">Same-day & next-day delivery available in selected areas</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105">
            <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-2xl">🎯</div>
            <h3 className="text-xl font-black text-gray-900 mb-3">Quality Assured</h3>
            <p className="text-gray-600 leading-relaxed">Rigorous quality checks & freshness guaranteed</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home