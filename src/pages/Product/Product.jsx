import './Product.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Product() {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')


  useEffect(() => {
    GetAllProducts();
  }, []);

  const GetAllProducts = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`
      )
      // Ensure res.data is an array; handle if it's an object with products key
      console.log(res.data?.data);
      setProducts(res.data?.data);
    } catch (err) {
      setError("Failed to load products")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['namkeen', 'sweet', 'ghee', 'makhan', 'icepops']
  const categoryLabels = {
    namkeen: '🥨 Namkeen',
    sweet: '🍬 Sweet',
    ghee: '🥄 Ghee',
    makhan: '🧈 Makhan',
    icepops: '🍦 Ice Pops'
  }

  const displayProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategory === 'all' || product.category?.name?.toLowerCase() === selectedCategory

    const searchMatch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    return categoryMatch && searchMatch
  })

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-4 rounded-2xl mb-8 text-center">
        <h1 className="text-4xl font-black mb-2">Our Products</h1>
        <p className="text-xl">Explore our collection of authentic Indian groceries & delicacies</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-lg"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="bg-white p-6 rounded-xl shadow h-fit sticky top-24">
          <h3 className="text-lg font-black text-gray-900 mb-4 pb-3 border-b-2 border-indigo-600">Filter by Category</h3>
          <div className="space-y-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
              >
                {categoryLabels[cat]} (
                {products.filter(p => p.category?.name?.toLowerCase() === cat).length}
                )

              </button>
            ))}
          </div>

          <h3 className="text-lg font-black text-gray-900 mt-6 mb-4 pb-3 border-b-2 border-indigo-600">Price Range</h3>
          <div className="space-y-2 text-gray-700">
            <p className="font-medium">₹50 - ₹1200</p>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {loading && (
            <p className="text-center text-lg font-semibold">
              Loading products...
            </p>
          )}

          {error && (
            <p className="text-center text-red-600 font-semibold">
              {error}
            </p>
          )}

          <div className="mb-6 text-gray-600">
            <p className="font-medium">Showing {displayProducts.length} products</p>
          </div>

          {!loading && !error && (
            <>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayProducts.map((product) => {
                  // Add this line to get the first size (or undefined if no sizes)
                  const mainSize = product.sizes?.[0];

                  return (
                    <Link to={`/product/${product._id}`} key={product._id} className="group bg-white rounded-xl shadow-md hover:shadow-2xl transform hover:-translate-y-3 transition duration-300 overflow-hidden flex flex-col" >
                      <div className="relative h-48 overflow-hidden bg-gray-200">
                        <img src={`${import.meta.env.VITE_API_URL}/${product.productImages?.[0]}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                        <span className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-black">{product.category?.name}</span>
                        {/* Fix the discount badge to use mainSize */}
                        {mainSize?.originalPrice > mainSize?.price && (
                          <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black">
                            {Math.round((1 - (mainSize.price / mainSize.originalPrice)) * 100)}% OFF
                          </span>
                        )}
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition">{product.name}</h3>
                        <p className="text-yellow-500 text-sm mb-2">★ {product.averageRating} ({product.totalReviews})</p>
                        <p className="text-gray-600 text-sm mb-4 flex-grow leading-relaxed">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <div>
                            {/* Use mainSize.price and mainSize.originalPrice */}
                            <span className="text-indigo-600 font-black text-xl">₹{mainSize?.price || product.price}</span>
                            {mainSize?.originalPrice > mainSize?.price && (
                              <span className="text-gray-400 line-through text-sm ml-2">₹{mainSize.originalPrice}</span>
                            )}
                          </div>
                          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition transform hover:scale-105 font-bold">+</button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {!loading && !error && displayProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div >
  )
}

export default Product
