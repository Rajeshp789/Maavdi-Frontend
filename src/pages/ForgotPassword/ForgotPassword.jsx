import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './ForgotPassword.css'
import axios from 'axios'
import { toast } from 'react-toastify'

function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resetToken, setResetToken] = useState(null);

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!email.trim()) {
      setError('Please enter your email address')
      setLoading(false)
      return
    }
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    // Simulate API call
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email, mode: "EMAIL" });
      console.log(response.data);
      toast.success(response.data.message);
      setSuccess(`OTP sent to ${email}`);
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    // Simulate API call
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, { email, otp, mode: "EMAIL" })
      console.log(response.data);
      toast.success(response.data.message);
      setResetToken(response.data.resetToken);
      setSuccess('OTP verified successfully!')
      setStep(3)
    } catch (error) {
      if (error.response?.status === 429) {
        setError("Too many incorrect attempts. Please request a new OTP.");
        setStep(1);           // Move back to email screen
        setOtp("");
      } else {
        setError(error.response?.data?.message || "Invalid OTP");
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!newPassword.trim()) {
      setError('Please enter a new password')
      setLoading(false)
      return
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    if (!strongPasswordRegex.test(newPassword)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number & special character"
      )
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Simulate API call
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, { newPassword, resetToken })
      console.log(response.data);
      toast.success(response.data.message);
      setSuccess('Password reset successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)

    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">Follow the steps to reset your password</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          <div className={`flex flex-col items-center flex-1 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-400'}`}>
              1
            </div>
            <p className="text-xs mt-2 text-gray-700 font-semibold">Email</p>
          </div>
          <div className={`flex-1 h-1 mx-2 mt-5 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
          <div className={`flex flex-col items-center flex-1 ${step >= 2 ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-400'}`}>
              2
            </div>
            <p className="text-xs mt-2 text-gray-700 font-semibold">Verify OTP</p>
          </div>
          <div className={`flex-1 h-1 mx-2 mt-5 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
          <div className={`flex flex-col items-center flex-1 ${step >= 3 ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-400'}`}>
              3
            </div>
            <p className="text-xs mt-2 text-gray-700 font-semibold">New Password</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 text-red-700 rounded-lg font-semibold">
              ✕ {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 text-green-700 rounded-lg font-semibold">
              ✓ {success}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit}>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Enter Your Email</h2>
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-2">Email Address</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 font-medium"
                />
                <p className="text-gray-600 text-sm mt-2">We'll send you a One Time Password (OTP) to verify your email</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit}>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Verify OTP</h2>
              <p className="text-gray-600 text-sm mb-6">Enter the 6-digit OTP sent to your email</p>
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-2">OTP Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 font-bold text-center text-2xl tracking-widest"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full border-2 border-indigo-600 text-indigo-600 font-bold py-3 rounded-lg hover:bg-indigo-50 transition"
              >
                Change Email
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Create New Password</h2>
              <div className="mb-4">
                <label className="block text-gray-900 font-bold mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 font-medium"
                />
                <p className="text-gray-600 text-xs mt-1">At least 8 characters</p>
              </div>
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>

        {/* Back to Login Link */}
        <div className="text-center">
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
