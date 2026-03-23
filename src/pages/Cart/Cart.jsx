import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Cart.css'
import axios from 'axios';
import { toast } from 'react-toastify';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [isCheckOut, setisCheckOut] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [shippingCharges, setShippingCharges] = useState(true);

  const fetchUserCart = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        { withCredentials: true }
      )

      const backendItems = response.data.data.items

      // Debug: Log raw backend items
      console.log('Raw Backend Items:', backendItems)

      const formattedItems = backendItems
        .filter(item => item.product) // Skip null/deleted products
        .map(item => ({
          id: item.product._id,                 // for React key & actions
          name: item.product.name,
          category: item.product.category?.name,
          price: item.price,                    // selected size price
          quantity: item.quantity,
          size: item.size,                      // IMPORTANT
          image: item.product?.productImages?.length
            ? `${import.meta.env.VITE_API_URL}/${item.product?.productImages[0]}`
            : 'https://via.placeholder.com/150'
        }))

      // Debug: Log the full image URLs
      // console.log('Cart Images:', formattedItems.map(i => ({ name: i.name, image: i.image })))

      setCartItems(formattedItems)
    } catch (error) {
      console.error("Failed to fetch cart", error)
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserCart()
  }, [])

  useEffect(() => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    if (subtotal > 500) {
      setShippingCharges(false)
    } else {
      setShippingCharges(true)
    }
  }, [cartItems])

  const updateQuantity = async (productId, size, qty) => {
    if (qty <= 0) return removeItem(productId, size);

    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/cart/update`,
        { productId, size, quantity: qty },
        { withCredentials: true }
      );
      // console.log(response);
      fetchUserCart()
    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.message || "Failed to update Quantity.");
    }
  }

  const removeItem = async (productId, size) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/`,
        {
          data: { productId, size },
          withCredentials: true
        });
      // console.log(response);
      toast.success(response.data.message);
      fetchUserCart();
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove Item.");
    }
  }

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  let shipping = 50;
  if (subtotal > 500) {
    shipping = 0;
  }

  // Tax is calculated on original subtotal, not after discount
  // const tax = Math.round(subtotal * 0.05)
  const total = subtotal + shipping - discountAmount

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }

    setCouponLoading(true)
    setCouponError('')

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/coupon-validate`,
        { couponCode: couponCode.trim() },
        { withCredentials: true }
      )
      console.log(response.data.data);
      const couponData = response.data.data

      setAppliedCoupon(couponData)
      setDiscountAmount(couponData.discountAmount)
      setCouponCode('')

      // Display message based on discount type from backend
      const message = couponData.type === 'fixed'
        ? `Coupon applied! ₹${couponData.discount} discount`
        : `Coupon applied! ${couponData.discount}% discount`
      toast.success(message)
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Invalid coupon code')
      setAppliedCoupon(null)
      setDiscountAmount(0)
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setDiscountAmount(0)
    setCouponCode('')
    setCouponError('')
    toast.info('Coupon removed')
  }

  const fetchUserAddresses = async () => {
    setAddressLoading(true);
    setAddressError('');
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/address`,
        { withCredentials: true }
      );
      console.log('User Addresses:', response.data);
      const addresses = response.data.data || [];
      setUserAddresses(addresses);
      if (addresses.length === 0) {
        setAddressError('No addresses found. Please add an address first.');
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
      setAddressError(error.response?.data?.message || 'Failed to fetch addresses');
      toast.error('Failed to fetch your addresses');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    fetchUserAddresses();
    setisCheckOut(true);
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading cart...</div>
  }

  const loadscript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    });
  }

  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    setPaymentLoading(true);
    try {
      // Step 1: Create order on backend - Backend calculates amounts from cart
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        { shippingCharges },
        { withCredentials: true }
      );

      const { orderId, orderNumber, amount, currency, receipt, originalTotal, discountAmount, finalAmount } = orderResponse.data.data;

      // Step 2: Load Razorpay script
      const res = await loadscript('https://checkout.razorpay.com/v1/checkout.js');

      if (!res) {
        toast.error('Razorpay SDK failed to load');
        setPaymentLoading(false);
        return;
      }

      // Step 3: Get user details for Razorpay
      const userResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user`,
        { withCredentials: true }
      );
      const user = userResponse.data.data;

      // Step 4: Open Razorpay payment modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay Key ID
        amount: amount, // Amount in paise (from backend)
        currency: currency || 'INR',
        name: 'Maavdi',
        description: `Order Payment - Amount: ₹${finalAmount}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            // Step 5: Verify payment on backend
            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
              {
                razorpay_order_id: orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderNumber,
                addressId: selectedAddress,
                shippingCharges
              },
              { withCredentials: true }
            );

            if (verifyResponse.data.success) {
              toast.success('🎉 Payment successful! Your order has been placed.');
              // Reset checkout and cart
              setisCheckOut(false);
              setSelectedAddress(null);
              fetchUserCart(); // Refresh cart to see if it's empty
              // Optionally redirect to order details or orders page
              // navigate(`/orders/${orderId}`);
            } else {
              toast.error(verifyResponse.data.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error(error.response?.data?.message || 'Payment verification failed');
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phoneNumber || ''
        },
        theme: {
          color: '#4F46E5' // Indigo color from your design
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
      setPaymentLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-4 rounded-2xl mb-8 text-center">
        <h1 className="text-4xl font-black mb-2">{isCheckOut ? 'Checkout' : 'Shopping Cart'}</h1>
        <p className="text-xl">{isCheckOut ? 'Select your delivery address' : 'Review and checkout your items'}</p>
      </div>

      {isCheckOut ? (
        // CHECKOUT VIEW - Address Selection with Order Summary
        <>
          <button
            onClick={() => setisCheckOut(false)}
            className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold py-2 px-4 rounded-lg hover:bg-indigo-50 transition-all duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cart
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Address Selection Section */}
            <div className="lg:col-span-2">
              {addressLoading ? (
                <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                  <div className="flex justify-center mb-4">
                    <svg className="w-12 h-12 text-indigo-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-lg">Loading your addresses...</p>
                </div>
              ) : addressError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-8 text-center">
                  <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 font-bold text-lg mb-4">{addressError}</p>
                  <Link
                    to="/profile"
                    className="inline-block bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-all duration-300">
                    Add Address Now
                  </Link>
                </div>
              ) : userAddresses.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-8 text-center">
                  <svg className="w-12 h-12 text-yellow-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <p className="text-yellow-800 font-bold text-lg mb-4">No addresses found</p>
                  <p className="text-yellow-700 mb-6">Please add an address to continue with your order</p>
                  <Link
                    to="/profile"
                    className="inline-block bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-700 transition-all duration-300">
                    Add Address Now
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Delivery Address</h2>
                    <p className="text-gray-600 mb-6">Select or add a delivery address</p>

                    <div className="space-y-4">
                      {userAddresses.map((address) => (
                        <div
                          key={address._id}
                          onClick={() => setSelectedAddress(address._id)}
                          className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group hover:shadow-lg ${selectedAddress === address._id
                            ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-indigo-300'
                            }`}>
                          {/* Selection Radio Button */}
                          <div className="absolute top-4 right-4">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${selectedAddress === address._id
                              ? 'border-indigo-600 bg-indigo-600'
                              : 'border-gray-300 group-hover:border-indigo-400'
                              }`}>
                              {selectedAddress === address._id && (
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>

                          {/* Address Details */}
                          <div className="pr-12">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{address.name}</h3>
                              {address.isDefault && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                  Default
                                </span>
                              )}
                            </div>

                            <div className="space-y-2 text-gray-700">
                              <p className="font-semibold">
                                {address.phoneNumber}
                              </p>
                              <p>
                                {address.street}, {address.city}, {address.state} {address.postalCode}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.country}
                              </p>
                            </div>
                          </div>

                          {/* Bottom accent bar */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-xl"></div>
                        </div>
                      ))}
                    </div>

                    {/* Add New Address Button */}
                    <Link
                      to="/profile"
                      className="mt-6 w-full block text-center py-3 px-6 text-indigo-600 font-bold hover:text-indigo-700 transition-all duration-300 hover:bg-indigo-50 rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                      + Add New Address
                    </Link>
                  </div>

                  {/* Continue Button */}
                  {selectedAddress && (
                    <button
                      onClick={handlePayment}
                      disabled={paymentLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black py-4 px-6 rounded-2xl hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center gap-3 disabled:cursor-not-allowed ">
                      {paymentLoading ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span>Proceed to Pay</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Order Summary - Sticky on Right */}
            <div>
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden sticky top-32 group hover:shadow-3xl transition-all duration-500">
                {/* Decorative gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Header with icon */}
                <div className="relative p-8 pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Order Summary
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm">Review your order details</p>
                </div>

                {/* Order Details */}
                <div className="relative px-8">
                  <div className="space-y-4">
                    {/* Subtotal */}
                    <div className="flex justify-between items-center p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors duration-300 group/item">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-indigo-100 rounded-lg group-hover/item:bg-indigo-200 transition-colors duration-300">
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">Subtotal</span>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">₹{subtotal}</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between items-center p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors duration-300 group/item">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-100 rounded-lg group-hover/item:bg-blue-200 transition-colors duration-300">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">Shipping</span>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">
                        {shipping === 0 ? (
                          <span className="text-green-600 font-black bg-green-50 px-2 py-1 rounded-full text-sm">FREE</span>
                        ) : (
                          `₹${shipping}`
                        )}
                      </span>
                    </div>

                    {/* Discount */}
                    {discountAmount > 0 && (
                      <div className="p-4 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl border-2 border-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300 group/discount overflow-hidden relative">
                        <div className="relative">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="flex-shrink-0 mt-1">
                                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg">
                                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-black text-green-800 text-base mb-1">🎉 Coupon Applied!</h3>
                                <p className="text-emerald-700 font-bold text-sm mb-1">{appliedCoupon?.code}</p>
                                <p className="text-green-600 text-xs">You saved <span className="font-black text-emerald-600">₹{Math.round(discountAmount)}</span></p>
                              </div>
                            </div>
                            <button
                              onClick={removeCoupon}
                              className="flex-shrink-0 p-2 rounded-lg bg-white/50 hover:bg-red-100 text-green-700 hover:text-red-600 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Divider with animation */}
                  <div className="my-6 relative">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  </div>
                </div>

                {/* Total Section */}
                <div className="relative px-8 pb-6">
                  <div className="p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold text-xl">Grand Total</span>
                      </div>
                      <span className="text-white font-black text-2xl">₹{total}</span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Banner */}
                {shipping === 0 && (
                  <div className="relative px-8 pb-6">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-green-100 rounded-full">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-green-700 font-bold text-sm">Free shipping on orders above ₹500</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom accent */}
                <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              </div>
            </div>
          </div>
        </>

      ) : (
        // CART VIEW
        cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 text-lg mb-6">Add some delicious products to get started</p>
            <Link to="/products" className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-black text-gray-900 mb-6">
                  Cart Items ({cartItems.length})
                </h2>

                <div className="space-y-6">

                  {cartItems.map(item => (
                    <div
                      key={item.id}
                      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out border border-gray-100 hover:border-indigo-200 overflow-hidden">

                      {/* Subtle gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-indigo-50/30 group-hover:via-purple-50/20 group-hover:to-pink-50/30 transition-all duration-500 rounded-2xl"></div>

                      <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
                        {/* Product Image with modern styling */}
                        <div className="relative flex-shrink-0">
                          <div className="w-28 h-28 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
                          </div>
                          {/* Category badge */}
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            {item.category}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start mb-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-gray-900 text-xl mb-1 truncate group-hover:text-indigo-700 transition-colors duration-300">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                  Size: {item.size}
                                </span>
                                <span className="text-sm text-gray-500">
                                  ₹{item.price} each
                                </span>
                              </div>
                            </div>

                            {/* Remove button with modern design */}
                            <button
                              onClick={() => removeItem(item.id, item.size)}
                              className="ml-4 p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          {/* Quantity Controls and Price */}
                          <div className="flex items-center justify-between">
                            {/* Modern Quantity Controls */}
                            <div className="flex items-center bg-gray-50 rounded-xl p-1 shadow-inner">
                              <button
                                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                className="p-2 rounded-lg bg-white shadow-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="px-4 py-2 font-bold text-gray-900 min-w-[3rem] text-center bg-white rounded-lg mx-1 shadow-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                className="p-2 rounded-lg bg-white shadow-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>

                            {/* Total Price with emphasis */}
                            <div className="text-right">
                              <div className="text-2xl font-black text-indigo-600 group-hover:text-purple-600 transition-colors duration-300">
                                ₹{item.price * item.quantity}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.quantity} × ₹{item.price}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom accent bar */}
                      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden sticky top-32 group hover:shadow-3xl transition-all duration-500">

                {/* Decorative gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Header with icon */}
                <div className="relative p-8 pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Order Summary
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm">Review your order details</p>
                </div>

                {/* Order Details */}
                <div className="relative px-8">
                  <div className="space-y-4">
                    {/* Subtotal */}
                    <div className="flex justify-between items-center p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors duration-300 group/item">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-indigo-100 rounded-lg group-hover/item:bg-indigo-200 transition-colors duration-300">
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">Subtotal</span>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">₹{subtotal}</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between items-center p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors duration-300 group/item">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-100 rounded-lg group-hover/item:bg-blue-200 transition-colors duration-300">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">Shipping</span>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">
                        {shipping === 0 ? (
                          <span className="text-green-600 font-black bg-green-50 px-2 py-1 rounded-full text-sm">FREE</span>
                        ) : (
                          `₹${shipping}`
                        )}
                      </span>
                    </div>

                    {/* Tax */}
                    {/* <div className="flex justify-between items-center p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors duration-300 group/item">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-purple-100 rounded-lg group-hover/item:bg-purple-200 transition-colors duration-300">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">Tax (5%)</span>
                    </div>
                    <span className="font-bold text-gray-900 text-lg">₹{tax}</span>
                  </div> */}

                    {/* Discount */}
                    {discountAmount > 0 && (
                      <div className="p-4 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl border-2 border-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300 group/discount overflow-hidden relative">
                        {/* Animated background accent */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-green-400/5 to-teal-400/0 opacity-0 group-hover/discount:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="flex-shrink-0 mt-1">
                                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg">
                                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-black text-green-800 text-base mb-1">🎉 Coupon Applied!</h3>
                                <p className="text-emerald-700 font-bold text-sm mb-1">{appliedCoupon?.code}</p>
                                <p className="text-green-600 text-xs">You saved <span className="font-black text-emerald-600">₹{Math.round(discountAmount)}</span>  </p>
                              </div>
                            </div>
                            <button
                              onClick={removeCoupon}
                              className="flex-shrink-0 p-2 rounded-lg bg-white/50 hover:bg-red-100 text-green-700 hover:text-red-600 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          {/* Bottom accent bar */}
                          <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 transform scale-x-0 group-hover/discount:scale-x-100 transition-transform duration-500 origin-left mt-3"></div>
                        </div>
                      </div>
                    )}

                    {/* Coupon Input Section */}
                    {!appliedCoupon && (
                      <div className="p-4 bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-pink-50/40 rounded-2xl border-2 border-indigo-200 hover:border-indigo-300 transition-all duration-300 group/coupon shadow-sm hover:shadow-md overflow-hidden relative">
                        {/* Animated gradient background on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-purple-400/5 to-pink-400/0 opacity-0 group-hover/coupon:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md flex-shrink-0">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                              </svg>
                            </div>
                            <label className="font-black text-gray-900 text-sm">Have a Promo Code?</label>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => {
                                setCouponCode(e.target.value.toUpperCase())
                                setCouponError('')
                              }}
                              placeholder="Enter coupon code"
                              className="flex-1 px-4 py-2.5 bg-white border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-bold placeholder-gray-400 transition-all duration-300 hover:border-indigo-300 min-w-0"
                            />
                            <button
                              onClick={applyCoupon}
                              disabled={couponLoading || !couponCode.trim()}
                              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:shadow-none disabled:-translate-y-0 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center gap-1.5 whitespace-nowrap flex-shrink-0 text-sm sm:text-base">
                              {couponLoading ? (
                                <>
                                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                  <span className="hidden sm:inline">Checking...</span>
                                </>
                              ) : (
                                <>
                                  <span>Apply</span>
                                </>
                              )}
                            </button>
                          </div>

                          {couponError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              <span className="text-red-700 font-medium text-sm">{couponError}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Divider with animation */}
                  <div className="my-6 relative">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    <div className="absolute inset-0 h-px bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"></div>
                  </div>
                </div>

                {/* Total Section */}
                <div className="relative px-8 pb-6">
                  <div className="p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold text-xl">Grand Total</span>
                      </div>
                      <span className="text-white font-black text-2xl">₹{total}</span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Banner */}
                {shipping === 0 && (
                  <div className="relative px-8 pb-6">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-green-100 rounded-full">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-green-700 font-bold text-sm">Free shipping on orders above ₹500</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="relative px-8 pb-8 space-y-4">
                  <button
                    onClick={handleProceedToCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black py-4 px-6 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center gap-3 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Proceed to Checkout
                  </button>

                  <Link
                    to="/products"
                    className="block w-full text-center py-3 px-6 text-indigo-600 font-bold hover:text-indigo-700 transition-all duration-300 hover:bg-indigo-50 rounded-xl border border-indigo-200 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                    Continue Shopping
                  </Link>
                </div>

                {/* Bottom accent */}
                <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default Cart
