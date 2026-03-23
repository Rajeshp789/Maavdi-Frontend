import { Link } from 'react-router-dom'
import { useState } from 'react'
import './Order.css'

function Order() {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orders] = useState([
    {
      id: 'ORD-001',
      date: '2024-11-20',
      status: 'Delivered',
      total: 450,
      items: 3,
      products: [
        { id: 'namkeen-1', name: 'Aloo Bhujia', price: 120, qty: 2, image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=500&h=500&fit=crop' },
        { id: 'sweet-1', name: 'Gulab Jamun', price: 200, qty: 1, image: 'https://images.unsplash.com/photo-1585518394957-2c128e90f465?w=500&h=500&fit=crop' }
      ],
      shipping: '2024-11-21',
      deliveryDate: '2024-11-22',
      address: '123 Main St, Mumbai, MH 400001'
    },
    {
      id: 'ORD-002',
      date: '2024-11-15',
      status: 'In Transit',
      total: 680,
      items: 2,
      products: [
        { id: 'ghee-1', name: 'Pure Cow Ghee', price: 600, qty: 1, image: 'https://images.unsplash.com/photo-1585518394957-2c128e90f465?w=500&h=500&fit=crop' },
        { id: 'makhan-1', name: 'Pure Cow Butter', price: 400, qty: 1, image: 'https://images.unsplash.com/photo-1585518394957-2c128e90f465?w=500&h=500&fit=crop' }
      ],
      shipping: '2024-11-16',
      deliveryDate: '2024-11-24',
      address: '123 Main St, Mumbai, MH 400001'
    },
    {
      id: 'ORD-003',
      date: '2024-11-10',
      status: 'Delivered',
      total: 320,
      items: 4,
      products: [
        { id: 'icepops-1', name: 'Mango Ice Pop', price: 50, qty: 4, image: 'https://images.unsplash.com/photo-1585518394957-2c128e90f465?w=500&h=500&fit=crop' }
      ],
      shipping: '2024-11-11',
      deliveryDate: '2024-11-12',
      address: '123 Main St, Mumbai, MH 400001'
    },
    {
      id: 'ORD-004',
      date: '2024-11-05',
      status: 'Delivered',
      total: 890,
      items: 5,
      products: [
        { id: 'namkeen-2', name: 'Chikhalwali', price: 150, qty: 2, image: 'https://images.unsplash.com/photo-1585518419759-6b4ee0767775?w=500&h=500&fit=crop' },
        { id: 'sweet-2', name: 'Jalebi', price: 180, qty: 1, image: 'https://images.unsplash.com/photo-1599599810974-d3977dec6276?w=500&h=500&fit=crop' }
      ],
      shipping: '2024-11-06',
      deliveryDate: '2024-11-07',
      address: '123 Main St, Mumbai, MH 400001'
    }
  ])

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-300'
      case 'In Transit': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Delivered': return '✓'
      case 'In Transit': return '📦'
      case 'Cancelled': return '✕'
      default: return '⏳'
    }
  }

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-4 rounded-2xl mb-8 text-center">
        <h1 className="text-4xl font-black mb-2">My Orders</h1>
        <p className="text-xl">Track and manage all your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">No orders yet</h2>
          <p className="text-gray-600 text-lg mb-6">Start shopping to place your first order</p>
          <Link to="/products" className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {orders.map(order => (
                <div 
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border-2 p-6 ${
                    selectedOrder?.id === order.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{order.id}</h3>
                      <p className="text-gray-600 text-sm">Placed on {order.date}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 border-2 ${getStatusColor(order.status)}`}>
                      <span>{getStatusIcon(order.status)}</span>
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600 text-xs font-semibold">Total Items</p>
                      <p className="text-gray-900 font-black text-lg">{order.items}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600 text-xs font-semibold">Total Amount</p>
                      <p className="text-indigo-600 font-black text-lg">₹{order.total}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600 text-xs font-semibold">Delivery</p>
                      <p className="text-gray-900 font-black text-lg">{order.deliveryDate}</p>
                    </div>
                  </div>

                  <button className="w-full text-indigo-600 hover:text-indigo-700 font-bold py-2 rounded-lg hover:bg-indigo-50 transition">
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-32">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Order Details</h2>

                {/* Order Status Timeline */}
                <div className="mb-6 pb-6 border-b-2 border-gray-200">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <div className="w-1 h-12 bg-gray-300 mt-1"></div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Order Placed</p>
                        <p className="text-gray-600 text-sm">{selectedOrder.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <div className="w-1 h-12 bg-gray-300 mt-1"></div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Shipped</p>
                        <p className="text-gray-600 text-sm">{selectedOrder.shipping}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className={`flex flex-col items-center`}>
                        <div className={`w-4 h-4 rounded-full ${selectedOrder.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Delivered</p>
                        <p className="text-gray-600 text-sm">{selectedOrder.deliveryDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mb-6 pb-6 border-b-2 border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">📍 Delivery Address</h3>
                  <p className="text-gray-700">{selectedOrder.address}</p>
                </div>

                {/* Products in Order */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.products.map(product => (
                      <div key={product.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                        <div className="flex-grow">
                          <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                          <p className="text-gray-600 text-xs">Qty: {product.qty}</p>
                        </div>
                        <p className="font-bold text-indigo-600">₹{product.price * product.qty}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="mt-6 pt-6 border-t-2 border-gray-200">
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-bold text-gray-900">₹{selectedOrder.total - 50}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-700">Shipping</span>
                    <span className="font-bold text-gray-900">₹50</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-black">
                    <span>Total</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-2">
                  <button className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition">
                    Track Order
                  </button>
                  <button className="w-full border-2 border-indigo-600 text-indigo-600 font-bold py-2 rounded-lg hover:bg-indigo-50 transition">
                    Reorder Items
                  </button>
                  <button className="w-full border-2 border-red-500 text-red-500 font-bold py-2 rounded-lg hover:bg-red-50 transition">
                    Report Issue
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-32 text-center">
                <p className="text-gray-600 font-semibold">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Order
