import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Profile.css'
import { useAuth } from '../../context/authContext';
import { toast } from 'react-toastify';
import axios from 'axios';

function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate()
  const [user, setUser] = useState({
    username: '',
    email: '',
    phone: '',
    addresses: []
  })

  const [addresses, setAddresses] = useState([])
  const [addingAddress, setAddingAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    addressLine: '',
    city: '',
    state: '',
    pin: '',
    isDefault: false
  })

  const [errors, setErrors] = useState({})
  const [addressErrors, setAddressErrors] = useState({})

  useEffect(() => {
    fetchUserDetail();
  }, []);
  const fetchUserDetail = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/`,
        { withCredentials: true }
      );
      setUser(response.data.user);
      setAddresses(response.data.user.addresses || []);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch user");
    }
  };

  const defaultAddress = addresses.find(a => a.isDefault);

  const [orders] = useState([
    {
      id: 'ORD-001',
      date: '2024-11-20',
      total: 450,
      status: 'Delivered',
      items: 3
    },
    {
      id: 'ORD-002',
      date: '2024-11-15',
      total: 680,
      status: 'In Transit',
      items: 2
    },
    {
      id: 'ORD-003',
      date: '2024-11-10',
      total: 320,
      status: 'Delivered',
      items: 4
    }
  ])

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(user)
  useEffect(() => {
    setEditData({
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || ""
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = (data) => {
    const newErrors = {};

    const username = data.username || '';
    const email = (data.email || '').trim().toLowerCase();
    const phone = data.phone || '';

    /* ---------- NAME ---------- */
    if (!username) {
      newErrors.username = "Name is required";
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(username)) {
      newErrors.username = "Name must contain only letters";
    }

    /* ---------- EMAIL ---------- */
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format"
    }

    /* ---------- PHONE ---------- */
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Enter valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

  }

  const validateAddress = (address) => {
    const newAddressErrors = {};

    /* ---------- FULL NAME ---------- */
    const fullName = (address.fullName || '').trim();
    if (!fullName) {
      newAddressErrors.fullName = "Full name is required";
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(fullName)) {
      newAddressErrors.fullName = "Name must contain only letters";
    }

    /* ---------- ADDRESS LINE ---------- */
    const addressLine = (address.addressLine || '').trim();
    if (!addressLine) {
      newAddressErrors.addressLine = "Address is required";
    } else if (addressLine.length < 5) {
      newAddressErrors.addressLine = "Address must be at least 5 characters";
    } else if (addressLine.length > 100) {
      newAddressErrors.addressLine = "Address must not exceed 100 characters";
    }

    /* ---------- CITY ---------- */
    const city = (address.city || '').trim();
    if (!city) {
      newAddressErrors.city = "City is required";
    } else if (!/^[a-zA-Z\s]{2,30}$/.test(city)) {
      newAddressErrors.city = "City must contain only letters";
    }

    /* ---------- STATE ---------- */
    const state = (address.state || '').trim();
    if (!state) {
      newAddressErrors.state = "State is required";
    } else if (!/^[a-zA-Z\s]{2,30}$/.test(state)) {
      newAddressErrors.state = "State must contain only letters";
    }

    /* ---------- PIN CODE ---------- */
    const pin = (address.pin || '').trim();
    if (!pin) {
      newAddressErrors.pin = "PIN code is required";
    } else if (!/^\d{6}$/.test(pin)) {
      newAddressErrors.pin = "PIN code must be exactly 6 digits";
    }

    setAddressErrors(newAddressErrors);
    return Object.keys(newAddressErrors).length === 0;
  }

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm(editData)) return;
    console.log(editData);

    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/user/profile`,
        editData,
        { withCredentials: true }
      )

      setUser(response.data.user);

      toast.success("Profile updated successfully")
      setIsEditing(false)
    } catch (error) {
      toast.error(error);
    }
  }

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!validateAddress(newAddress)) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/address`,
        newAddress,
        { withCredentials: true }
      );

      toast.success("Address added successfully");
      setAddingAddress(false);
      setNewAddress({
        fullName: '',
        addressLine: '',
        city: '',
        state: '',
        pin: '',
        isDefault: false
      });

      fetchUserDetail(); // 🔥 sync with DB
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add address");
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/address/${addressId}`,
        { withCredentials: true }
      );

      toast.success("Address deleted");
      fetchUserDetail(); // refresh from DB
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/user/address/${addressId}/default`,
        {},
        { withCredentials: true }
      );

      toast.success("Default address updated");
      fetchUserDetail(); // 🔥 refresh from DB
    } catch (error) {
      toast.error("Failed to set default address");
    }
  };

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully!')
    navigate('/')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700'
      case 'In Transit': return 'bg-blue-100 text-blue-700'
      case 'Pending': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-4 rounded-2xl mb-8 text-center">
        <h1 className="text-4xl font-black mb-2">My Profile</h1>
        <p className="text-xl">Manage your account and orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-32">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-gray-900">{user.username}</h2>
              <p className="text-gray-600 mt-1">{user.email}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-lg">📱</span>
                <span>{user.phone ? user.phone : "Not Provided"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-lg">📍</span>
                <span className="text-sm">
                  {defaultAddress
                    ? `${defaultAddress.addressLine}, ${defaultAddress.city}`
                    : "Not Provided"}
                </span>

              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition mb-3"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {isEditing ? (
            // Edit Form
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Edit Profile</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Full Name</label>
                    <input
                      type="text"
                      name="username"
                      value={editData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                    />
                    {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                    />
                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            // Profile Info
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Account Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm font-semibold">Full Name</p>
                    <p className="text-gray-900 font-bold text-lg">{user.username}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm font-semibold">Email</p>
                    <p className="text-gray-900 font-bold text-lg">{user.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm font-semibold">Phone</p>
                    <p className="text-gray-900 font-bold text-lg">{user.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Addresses */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Addresses</h3>
            {addresses.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No addresses added yet</p>
            ) : (
              <div className="space-y-4">
                {addresses.map(addr => (
                  <div key={addr._id} className="border-2 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{addr.fullName}</p>
                        <p>{addr.addressLine}</p>
                        <p>{addr.city}, {addr.state} - {addr.pin}</p>
                      </div>

                      {addr.isDefault && (
                        <span className="text-yellow-500 font-bold">⭐ Default</span>
                      )}
                    </div>

                    <div className="mt-3 flex gap-4">
                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(addr._id)}
                          className="text-indigo-600 font-bold hover:underline"
                        >
                          Set Default
                        </button>
                      )}

                      <button
                        onClick={() => deleteAddress(addr._id)}
                        className="text-red-600 font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setAddingAddress(!addingAddress)}
              className="w-full mt-4 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {addingAddress ? 'Cancel' : 'Add New Address'}
            </button>
            {addingAddress && (
              <form onSubmit={handleAddAddress} className="mt-4 space-y-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Reciever's Name</label>
                  <input
                    type="text"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${addressErrors.fullName ? 'border-red-600' : 'border-gray-300 focus:border-indigo-600'
                      }`}
                  />
                  {addressErrors.fullName && <p className="text-red-600 text-sm mt-1">{addressErrors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Address</label>
                  <input
                    type="text"
                    value={newAddress.addressLine}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${addressErrors.addressLine ? 'border-red-600' : 'border-gray-300 focus:border-indigo-600'
                      }`}
                  />
                  {addressErrors.addressLine && <p className="text-gray-900 font-bold">{addr.addressLine}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">City</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${addressErrors.city ? 'border-red-600' : 'border-gray-300 focus:border-indigo-600'
                        }`}
                    />
                    {addressErrors.city && <p className="text-red-600 text-sm mt-1">{addressErrors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">State</label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${addressErrors.state ? 'border-red-600' : 'border-gray-300 focus:border-indigo-600'
                        }`}
                    />
                    {addressErrors.state && <p className="text-red-600 text-sm mt-1">{addressErrors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">PIN Code</label>
                    <input
                      type="text"
                      value={newAddress.pin}
                      onChange={(e) => setNewAddress({ ...newAddress, pin: e.target.value })}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${addressErrors.pin ? 'border-red-600' : 'border-gray-300 focus:border-indigo-600'
                        }`}
                    />
                    {addressErrors.pin && <p className="text-red-600 text-sm mt-1">{addressErrors.pin}</p>}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Add Address
                </button>
              </form>
            )}
          </div>

          {/* Orders */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Order History</h3>
            {orders.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-600 transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-gray-900">Order {order.id}</p>
                        <p className="text-gray-600 text-sm">{order.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full font-bold text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{order.items} items</span>
                      <span className="text-indigo-600 font-black text-lg">₹{order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link to="/products" className="block w-full text-center mt-6 text-indigo-600 hover:text-indigo-700 font-bold">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
