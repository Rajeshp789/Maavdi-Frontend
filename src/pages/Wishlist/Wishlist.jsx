import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Wishlist.css'
import { toast } from 'react-toastify'
import axios from 'axios'

function Wishlist() {
  const [loading, setLoading] = useState(true)
  const [wishlistItems, setWishlistItems] = useState([])

  /* ================= FETCH WISHLIST ================= */
  useEffect(() => {
    const fetchAllWishlist = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/wishlist`,
          { withCredentials: true }
        )

        setWishlistItems(response.data?.data || [])
      } catch (error) {
        console.error(error)
        toast.error('Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchAllWishlist()
  }, [])

  /* ================= REMOVE FROM WISHLIST ================= */
  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/wishlist/remove/${productId}`,
        { withCredentials: true }
      )

      setWishlistItems(prev =>
        prev.filter(item => item.product._id !== productId)
      )

      toast.success('Removed from wishlist')
    } catch (error) {
      console.error(error)
      toast.error('Failed to remove item')
    }
  }

  /* ================= ADD TO CART (PLACEHOLDER) ================= */
  const handleAddToCart = (product, size) => {
    toast.success(`${product.name} added to cart`)
    // TODO: integrate cart API
  }

  /* ================= DISCOUNT ================= */
  const discount = (price, originalPrice) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-bold text-gray-600">
        Loading wishlist...
      </div>
    )
  }

  /* ================= EMPTY STATE ================= */
  if (wishlistItems.length === 0) {
    return (
      <div className="w-full">
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            Wishlist is Empty
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Add products to your wishlist to save them for later
          </p>
          <Link
            to="/products"
            className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-4 rounded-2xl mb-8 text-center">
        <h1 className="text-4xl font-black mb-2">My Wishlist</h1>
        <p className="text-xl">Save your favorite products</p>
      </div>

      <p className="text-gray-600 font-semibold text-lg mb-6">
        {wishlistItems.length} items in wishlist
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlistItems.map(item => {
          const product = item.product
          
          // Skip if product is null (deleted from database)
          if (!product) {
            return null
          }
          
          const selectedSize = product.sizes?.[0]

          return (
            <div
              key={item._id}
              className="group bg-white rounded-xl shadow-md hover:shadow-2xl transform hover:-translate-y-3 transition duration-300 overflow-hidden flex flex-col"
            >
              <Link to={`/product/${product._id}`}>

                {/* IMAGE */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${product.productImages?.[0]}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />

                  <div className="absolute top-4 right-4 bg-indigo-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                    ₹{selectedSize.price}
                  </div>

                  {discount(selectedSize.price, selectedSize.originalPrice) > 0 && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                      -{discount(selectedSize.price, selectedSize.originalPrice)}%
                    </div>
                  )}
                </div>
              </Link>
              {/* CONTENT */}
              <div className="p-6 flex-grow flex flex-col">
                <span className="text-sm font-semibold text-indigo-600 mb-2">
                  {product.category?.name}
                </span>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold">
                    {product.averageRating}
                  </span>
                  <span className="text-gray-500 text-sm">
                    ({product.totalReviews})
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-black text-indigo-600">
                    ₹{selectedSize.price}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{selectedSize.originalPrice}
                  </span>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() =>
                      handleAddToCart(product, selectedSize)
                    }
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition transform hover:scale-105"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() =>
                      handleRemoveFromWishlist(product._id)
                    }
                    className="flex-shrink-0 bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2 px-4 rounded-lg transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div >
  )
}

export default Wishlist
