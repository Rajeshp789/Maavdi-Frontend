import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Login.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/authContext'

// Login/Register component for user authentication
function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  // Update form data on input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Validate form fields with specific rules for login/register
  const validateForm = () => {
    const newErrors = {}

    // Normalize inputs
    const email = formData.email?.trim().toLowerCase()
    const username = formData.username?.trim()
    const password = formData.password
    const confirmPassword = formData.confirmPassword

    /* ================= EMAIL ================= */
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format"
    }

    /* ================= PASSWORD ================= */
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    if (!password) {
      newErrors.password = "Password is required"
    } else if (!strongPasswordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number & special character"
    }

    /* ================= REGISTER ONLY ================= */
    if (!isLogin) {
      /* ---------- Username ---------- */
      if (!username) {
        newErrors.username = "Username is required"
      } else if (username.length < 3 || username.length > 30) {
        newErrors.username = "Username must be 3–30 characters"
      } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        newErrors.username =
          "Username can contain letters, numbers and underscores only"
      } else if (/^\d+$/.test(username)) {
        newErrors.username = "Username cannot be only numbers"
      }

      /* ---------- Confirm Password ---------- */
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission for login or register
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm(formData)) return;

    // console.log(isLogin ? 'Logging in with' : 'Registering with', formData)

    if (isLogin) {
      // Login logic: send credentials to backend
      const loginPayload = {
        email: formData.email,
        password: formData.password
      };

      axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, loginPayload, { withCredentials: true })
        .then(response => {
          console.log('Success:', response.data)
          toast.success(response.data.message);
           
          login(response.data.user);
          // Redirect or show success message
          navigate('/')
        })
        .catch(error => {
          toast.error(error.response?.data?.error || 'Login failed. Please try again.');
          console.error('Error:', error.response?.data || error.message)
        })

    } else {
      // Register logic: send user data to backend
      const registerPayload = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      };
      axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, registerPayload)
        .then(response => {
          console.log('Success:', response.data)
          toast.success(response.data.message);
          login(response.data.user);

          // Redirect or show success message
          navigate('/')
        })
        .catch(error => {
          console.error('Error:', error.response?.data || error.message)
          toast.error(error.response?.data?.error || 'Register failed. Please try again.');
        })
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-black text-2xl">M</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Maavdi</h1>
            <p className="text-gray-600">{isLogin ? 'Welcome back!' : 'Join us today'}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {!isLogin && (
              <div>
                <label className="block text-gray-700 font-bold mb-2">Full Name</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${errors.username ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-indigo-600'
                    }`}
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${errors.email ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-indigo-600'
                  }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${errors.password ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-indigo-600'
                  }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-gray-700 font-bold mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${errors.confirmPassword ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-indigo-600'
                    }`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <Link to="/forgotPassword" className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">Forgot password?</Link>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center pt-6 border-t-2 border-gray-200">
            <p className="text-gray-700 mb-3">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setFormData({ email: '', password: '', username: '', confirmPassword: '' })
                setErrors({})
              }}
              className="text-indigo-600 hover:text-indigo-700 font-black text-lg"
            >
              {isLogin ? 'Create Account' : 'Login'}
            </button>
          </div>

          {/* Links */}
          <div className="mt-6 pt-6 border-t-2 border-gray-200 text-center">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-semibold">Back to Home</Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl mb-2">🔒</div>
            <p className="text-gray-700 font-bold text-sm">Secure</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-gray-700 font-bold text-sm">Fast</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl mb-2">✨</div>
            <p className="text-gray-700 font-bold text-sm">Easy</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
