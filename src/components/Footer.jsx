import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">UrbanWash</h3>
            <p className="text-gray-400">Professional laundry service delivered to your doorstep.</p>
            <div className="flex space-x-4 mt-4">
              <Facebook className="cursor-pointer hover:text-primary transition" size={20} />
              <Instagram className="cursor-pointer hover:text-primary transition" size={20} />
              <Twitter className="cursor-pointer hover:text-primary transition" size={20} />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-gray-400 hover:text-white transition">Services</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white transition">Pricing</Link></li>
              <li><Link to="/track" className="text-gray-400 hover:text-white transition">Track Order</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Wash & Dry</li>
              <li>Wash & Iron</li>
              <li>Dry Cleaning</li>
              <li>Subscription Plans</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-2">
                <Phone size={18} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} />
                <span>info@urbanwash.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={18} />
                <span>Nallasopara, Palghar</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 UrbanWash. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
