import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-16 border-t-4 border-indigo-600">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <h3 className="text-xl font-bold">Maavdi</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">Premium designs and products crafted with excellence for modern living.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-indigo-400">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-indigo-400 transition font-medium">Home</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-indigo-400 transition font-medium">Products</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-indigo-400 transition font-medium">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-indigo-400 transition font-medium">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-indigo-400">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-indigo-400 transition font-medium">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-indigo-400 transition font-medium">Privacy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-indigo-400 transition font-medium">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-indigo-400">Contact</h4>
            <p className="text-gray-300 text-sm mb-2">📧 info@maavdi.com</p>
            <p className="text-gray-300 text-sm mb-2">📞 +1 (555) 123-4567</p>
            <p className="text-gray-300 text-sm">📍 123 Design St, City</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">&copy; 2024 Maavdi Design. Crafted with <span className="text-red-500">❤</span> by designers.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
