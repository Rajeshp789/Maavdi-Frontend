import { useState } from 'react'
import './ContactUs.css'

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12 px-4 rounded-lg mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-xl">We'd love to hear from you. Get in touch with us today!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
          
          <div className="mb-6">
            <h3 className="font-bold text-blue-500 mb-2">Email</h3>
            <p>
              <a href="mailto:info@maavdi.com" className="text-gray-600 hover:text-blue-500 transition">info@maavdi.com</a>
            </p>
            <p>
              <a href="mailto:support@maavdi.com" className="text-gray-600 hover:text-blue-500 transition">support@maavdi.com</a>
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-blue-500 mb-2">Phone</h3>
            <p>
              <a href="tel:+15551234567" className="text-gray-600 hover:text-blue-500 transition">+1 (555) 123-4567</a>
            </p>
            <p>
              <a href="tel:+15557654321" className="text-gray-600 hover:text-blue-500 transition">+1 (555) 765-4321</a>
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-blue-500 mb-2">Address</h3>
            <p className="text-gray-600">123 Design Street</p>
            <p className="text-gray-600">Creative City, CC 12345</p>
            <p className="text-gray-600">United States</p>
          </div>

          <div>
            <h3 className="font-bold text-blue-500 mb-2">Business Hours</h3>
            <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
            <p className="text-gray-600">Sunday: Closed</p>
          </div>
        </div>

        {/* Contact Form */}
        <form className="bg-white p-8 rounded-lg shadow" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="subject" className="block text-gray-700 font-bold mb-2">Subject *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Subject"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Your message here..."
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            ></textarea>
          </div>

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded transition duration-300">Send Message</button>
        </form>
      </div>
    </div>
  )
}

export default ContactUs
