import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="" className="h-12 w-auto" />
            <span className="text-2xl font-bold text-gray-900">UrbanWash</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary transition">Dashboard</Link>
                <Link to="/book" className="text-gray-700 hover:text-primary transition">Book Order</Link>
                <Link to="/track" className="text-gray-700 hover:text-primary transition">Track Order</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary transition">Admin</Link>
                )}
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary transition">
                    <User size={20} />
                    <span>{user?.name}</span>
                  </Link>
                  <button onClick={handleLogout} className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition">
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/" className="text-gray-700 hover:text-primary transition">Home</Link>
                <Link to="/services" className="text-gray-700 hover:text-primary transition">Services</Link>
                <Link to="/pricing" className="text-gray-700 hover:text-primary transition">Pricing</Link>
                <Link to="/track" className="text-gray-700 hover:text-primary transition">Track Order</Link>
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-700 hover:text-primary transition">Login</Link>
                  <Link to="/register" className="btn-primary">Get Started</Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block text-gray-700 hover:text-primary transition">Dashboard</Link>
                <Link to="/book" className="block text-gray-700 hover:text-primary transition">Book Order</Link>
                <Link to="/track" className="block text-gray-700 hover:text-primary transition">Track Order</Link>
                <Link to="/profile" className="block text-gray-700 hover:text-primary transition">Profile</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block text-gray-700 hover:text-primary transition">Admin</Link>
                )}
                <button onClick={handleLogout} className="block text-red-600 hover:text-red-700 transition">Logout</button>
              </>
            ) : (
              <>
                <Link to="/" className="block text-gray-700 hover:text-primary transition">Home</Link>
                <Link to="/services" className="block text-gray-700 hover:text-primary transition">Services</Link>
                <Link to="/pricing" className="block text-gray-700 hover:text-primary transition">Pricing</Link>
                <Link to="/track" className="block text-gray-700 hover:text-primary transition">Track Order</Link>
                <Link to="/login" className="block text-gray-700 hover:text-primary transition">Login</Link>
                <Link to="/register" className="block text-primary font-semibold">Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
