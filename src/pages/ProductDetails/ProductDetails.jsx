import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './ProductDetails.css'
import { useAuth } from '../../context/authContext'
import { toast } from 'react-toastify'
import axios from 'axios'

function ProductDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(0)
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [product, setProduct] = useState(null)
  const { isAuthenticated, user }   = useAuth()
  const [reviews, setReviews] = useState([
    {
      name: 'Raj Kumar',
      rating: 5,
      text: 'Excellent quality and fresh product. Highly recommended!',
      date: '2 days ago'
    },
    {
      name: 'Priya Singh',
      rating: 4,
      text: 'Good quality. Fast delivery. Will order again!',
      date: '1 week ago'
    },
    {
      name: 'Amit Patel',
      rating: 5,
      text: 'Best price and authentic products. Trusted this brand now.',
      date: '2 weeks ago'
    }
  ])

  const [isInWishlist, setIsInWishlist] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkWishlist = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/wishlist/check/${id}`,
          { withCredentials: true }
        );

        setIsInWishlist(res.data.inWishlist);
      } catch {
        setIsInWishlist(false);
      }
    };

    checkWishlist();
  }, [id, isAuthenticated]);


  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add product to wishlist');
      navigate('/login');
      return;
    }

    try {
      if (!isInWishlist) {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/wishlist/add`,
          { productId: id },
          { withCredentials: true }
        );

        setIsInWishlist(true);
        toast.success('✓ Added to Wishlist!');
      } else {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/wishlist/remove/${id}`,
          { withCredentials: true }
        );

        setIsInWishlist(false);
        toast.success('Removed from Wishlist!');
      }
    } catch (error) {
      console.error(error);

      // 🔥 Handle duplicate wishlist case
      if (error.response?.status === 409) {
        toast.info(error.response.data?.message || 'Already in wishlist');
        setIsInWishlist(true);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  // Find product 
  useEffect(() => {
    fetchProductById(id)
  }, [id])

  const fetchProductById = async (id) => {
    try {
      const response = await axios(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
      const data = await response.data
      console.log(data.data)
      setProduct(data.data)
    }
    catch (error) {
      console.error('Error fetching product data:', error)
    }
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Link to="/products" className="text-indigo-600 hover:text-indigo-700 font-bold">Back to Products</Link>
      </div>
    )
  }

  // Get current selected size
  const currentSize = product.sizes[selectedSize];

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error(`Please log in to add item into cart`)
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/add`,
        {
          productId: id,
          size: currentSize.size
        },
        { withCredentials: true }
      );

      console.log(response);
      toast.success(response.data.message);

    } catch (error) {
      console.log(error);
      const msg =
        error.response?.data?.message ||
        "Something went wrong";

      toast.error(msg);
    }
  }

  const handleSubmitReview = async () => {

    if (!isAuthenticated) {
      toast.error('Please log in to submit a review')
      navigate('/login')
      // setLoading(false)
      return
    }

    if (reviewText.trim() === '') {
      toast.error('Please write a review')
      // setLoading(false)
      return
    }

    const newReview = {
      userId: user._id,
      rating: rating,
      comment: reviewText,
    }

    try {
      console.log('Review submitted:', newReview)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/products/${id}/review`, newReview)
      console.log(response.data);
      setReviews([...reviews, response.data.review])
      toast.success('Review submitted successfully!')
      toast.success(response.data.message)

      // Optionally, you can update the reviews list to include the new review
      setReviews((prevReviews) => [response.data.review, ...prevReviews])
      setReviewText('')
      setRating(0)

    } catch (error) {
      toast.error('Error submitting review. Please try again later.')
      console.error('Error:', error.response?.data || error.message)
    }
  }

  const discount = Math.round((1 - currentSize.price / currentSize.originalPrice) * 100)

  return (
    <div className="w-full">
      <div className="mb-6 text-sm text-gray-600">
        <Link to="/" className="text-indigo-600 hover:text-indigo-700">Home</Link> / <Link to="/products" className="text-indigo-600 hover:text-indigo-700">Products</Link> / <span className="text-gray-500">{product.category?.name}</span> / <span className="text-gray-500">{product.name}</span>
      </div>

      {/* Main Product Section - Image and Title Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 bg-white p-8 rounded-lg shadow mb-8">
        {/* Product Image Gallery - Left Side - Larger */}
        <div className="product-image-section md:col-span-2">
          {/* Main Image */}
          <div className="image-gallery-main">
            <img src={`${import.meta.env.VITE_API_URL}/${product.productImages?.[selectedImage]}`} alt={product.name} className="gallery-main-image" />

            {/* Image Navigation Arrows */}
            {product.productImages.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((prev) => (prev === 0 ? product.productImages?.length - 1 : prev - 1))}
                  className="gallery-arrow-btn prev"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev === product.productImages?.length - 1 ? 0 : prev + 1))}
                  className="gallery-arrow-btn next"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.productImages.length > 1 && (
            <div className="thumbnail-gallery">
              {product.productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`thumbnail-item ${selectedImage === idx ? 'active' : ''}`}
                  aria-label={`View image ${idx + 1}`}
                  aria-pressed={selectedImage === idx}
                >
                  <img src={`${import.meta.env.VITE_API_URL}/${product.productImages[idx]}`} alt={`${product.name} ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Title, Price & Info - Right Side */}
        <div className="md:col-span-3">
          <div className="mb-3 inline-block">
            <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold">{product.category?.name}</span>
          </div>

          <h1 className="text-4xl font-black text-gray-900 mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-2xl">★ {product.averageRating}</span>
              <span className="text-gray-600 font-semibold">({product.totalReviews} reviews)</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-indigo-600">₹{currentSize.price}</span>
              {currentSize.originalPrice > currentSize.price && (
                <span className="text-lg text-gray-400 line-through">₹{currentSize.originalPrice}</span>
              )}
              {discount > 0 && (
                <span className="text-xl font-black text-red-600 bg-red-100 px-3 py-1 rounded">{discount}% OFF</span>
              )}
            </div>
          </div>

          <p className="text-gray-700 mb-6 text-lg leading-relaxed">{product.description}</p>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 1 && (
            <div className="mb-6">
              <label className="block text-gray-900 font-bold mb-3">Select Size:</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sizeOption, idx) => {
                  const sizeDiscount = Math.round((1 - sizeOption.price / sizeOption.originalPrice) * 100)
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(idx)}
                      className={`px-4 py-3 rounded-lg border-2 font-bold transition ${selectedSize === idx
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-300'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-400'
                        }`}
                    >
                      <div className="text-sm font-bold">{sizeOption.size}</div>
                      <div className="text-xs mt-1">
                        ₹{sizeOption.price}
                        {sizeDiscount > 0 && <span className="ml-1 text-red-600">-{sizeDiscount}%</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-6 border-2 border-green-300">
            <p className="text-green-700 font-bold flex items-center">
              <span className="text-2xl mr-3">✓</span>
              In Stock ({currentSize.stock} available)
            </p>
          </div>

          {/* Quantity and Add to Cart - One Line */}
          <div className="flex gap-4 items-end">
            {/* <div className="flex-shrink-0">
              <label htmlFor="quantity" className="block text-gray-900 font-bold mb-2">Quantity:</label>
              <select id="quantity" value={quantity} onChange={handleQuantityChange} className="px-4 py-3 border-2 border-indigo-600 rounded-lg focus:outline-none bg-white font-bold">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div> */}
            <div className="flex-grow flex gap-5">
              <button
                onClick={handleAddToCart}
                disabled={currentSize.stock === 0}
                className={`flex-grow py-3 px-6 rounded-lg font-bold text-white transition
              ${currentSize.stock === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105"
                  }`}
              >
                {currentSize.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                onClick={toggleWishlist}
                className={`py-3 px-6 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 ${isInWishlist
                  ? 'text-white bg-red-600 border-2 border-red-600 hover:bg-red-700 shadow-lg'
                  : 'text-red-600 bg-red-50 border-2 border-red-600 hover:bg-red-100'
                  }`}
                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                {isInWishlist ? '♥' : '♡'}
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Complete Product Information with Show More */}
      <div className="bg-white p-8 rounded-lg shadow mb-8">
        <h2 className="text-3xl font-black text-gray-900 mb-6 pb-4 border-b-4 border-indigo-600">Product Highlights</h2>

        <div className="bg-gray-50 p-6 rounded-lg border-2 border-indigo-200 mb-6">
          <ul className="space-y-3">
            <li className="text-gray-700 flex items-start"><span className="text-indigo-600 font-black mr-3 text-lg">✓</span><span>{product.ingredients}</span></li>
            <li className="text-gray-700 flex items-start"><span className="text-indigo-600 font-black mr-3 text-lg">✓</span><span>Weight: {product.weight}</span></li>
            <li className="text-gray-700 flex items-start"><span className="text-indigo-600 font-black mr-3 text-lg">✓</span><span>Shelf Life: {product.expiry}</span></li>
            <li className="text-gray-700 flex items-start"><span className="text-indigo-600 font-black mr-3 text-lg">✓</span><span>100% Authentic & Fresh</span></li>
          </ul>
        </div>

        {/* Show More Button */}
        <button
          onClick={() => setShowMoreInfo(!showMoreInfo)}
          className="w-full py-3 px-6 rounded-lg font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-600 transition mb-6"
        >
          {showMoreInfo ? '▼ Show Less' : '▶ Show More Information'}
        </button>

        {/* Expanded Information */}
        {showMoreInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t-2 border-gray-200 animate-in fade-in duration-300">
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-4">Specifications</h3>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                  <span className="font-bold text-gray-800">Category</span>
                  <p className="text-gray-700">{product.category?.name}</p>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                  <span className="font-bold text-gray-800">Weight</span>
                  <p className="text-gray-700">{product.weight}</p>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                  <span className="font-bold text-gray-800">Ingredients</span>
                  <p className="text-gray-700">{product.ingredients}</p>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                  <span className="font-bold text-gray-800">Expiry</span>
                  <p className="text-gray-700">{product.expiry}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-gray-900 mb-4">Delivery & Returns</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <p className="font-bold text-blue-900">🚚 Free Delivery</p>
                  <p className="text-blue-800 text-sm">On orders above ₹500</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                  <p className="font-bold text-green-900">⏱️ Fast Delivery</p>
                  <p className="text-green-800 text-sm">Within 24-48 hours</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
                  <p className="font-bold text-purple-900">↩️ Easy Returns</p>
                  <p className="text-purple-800 text-sm">7 days return policy</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                  <p className="font-bold text-orange-900">✅ 100% Original</p>
                  <p className="text-orange-800 text-sm">Authenticity guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Panel */}
        <div className="pt-8 border-t-2 border-gray-200">
          <h3 className="text-2xl font-black text-gray-900 mb-6">Customer Reviews</h3>

          {/* Add Review Form */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg mb-8 border-2 border-indigo-200">
            <h4 className="text-lg font-black text-gray-900 mb-4">Write Your Review</h4>

            {/* Star Rating */}
            <div className="mb-4">
              <label className="block text-gray-900 font-bold mb-2">Rate this product:</label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-4xl transition transform hover:scale-125"
                  >
                    <span className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">Selected: {rating} stars</p>
            </div>

            {/* Review Text Area */}
            <div className="mb-4">
              <label htmlFor="review-text" className="block text-gray-900 font-bold mb-2">Your Review:</label>
              <textarea
                id="review-text"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this product... (minimum 10 characters)"
                className="w-full px-4 py-3 border-2 border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 font-medium resize-none"
                rows={4}
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">{reviewText.length} characters</p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitReview}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105"
            >
              Submit Review
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{review.name}</span>
                    <span className="text-yellow-500">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-700">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* More Products */}
      <div className="bg-white p-8 rounded-lg shadow">
        <h3 className="text-2xl font-black text-gray-900 mb-4">More Products</h3>
        <p className="text-gray-600">Explore more <Link to="/products" className="text-indigo-600 hover:text-indigo-700 font-black">products from our collection</Link></p>
      </div>
    </div>
  )
}

export default ProductDetails
