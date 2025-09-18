import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-cream-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-gradient-brand mb-4">EasyKirana</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Your trusted neighborhood store for fresh groceries and daily essentials. 
              Quality products delivered right to your doorstep.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>support@easykirana.com</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>123 Main Street, City, State 12345</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-600 hover:text-brand-600">About Us</a></li>
              <li><a href="/products" className="text-gray-600 hover:text-brand-600">Products</a></li>
              <li><a href="/categories" className="text-gray-600 hover:text-brand-600">Categories</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-brand-600">Contact</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="/help" className="text-gray-600 hover:text-brand-600">Help Center</a></li>
              <li><a href="/shipping" className="text-gray-600 hover:text-brand-600">Shipping Info</a></li>
              <li><a href="/returns" className="text-gray-600 hover:text-brand-600">Returns</a></li>
              <li><a href="/privacy" className="text-gray-600 hover:text-brand-600">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            © 2024 EasyKirana. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}