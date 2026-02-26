import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, 
  FiSearch, 
  FiPlus, 
  FiBarChart2, 
  FiUser, 
  FiLogOut,
  FiMenu,
  FiX,
  FiSettings,
  FiChevronDown
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <span className="text-white text-xl font-bold">SK</span>
            </div>
            <span className="text-xl font-bold text-gray-800 hidden md:block">
              Smart Knowledge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <FiHome />
              <span>Home</span>
            </Link>

            <Link
              to="/search"
              className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <FiSearch />
              <span>Search</span>
            </Link>

            {user && (
              <Link
                to="/create"
                className="flex items-center space-x-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                <FiPlus />
                <span>Create</span>
              </Link>
            )}

            {user && isAdmin() && (
              <Link
                to="/analytics"
                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <FiBarChart2 />
                <span>Analytics</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    {user.avatar ? (
                      <img
                        src={`http://localhost:5000${user.avatar}`}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium">{user.name}</span>
                    {user.role === 'admin' && (
                      <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded">
                        Admin
                      </span>
                    )}
                    <FiChevronDown className={`transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <Link
                        to="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition"
                      >
                        <FiSettings />
                        <span>Settings</span>
                      </Link>
                      <Link
                        to={`/profile/${user._id}`}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition"
                      >
                        <FiUser />
                        <span>Profile</span>
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          handleLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 w-full text-red-600 hover:bg-red-50 transition"
                      >
                        <FiLogOut />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t">
            <Link
              to="/"
              onClick={toggleMobileMenu}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <FiHome />
              <span>Home</span>
            </Link>

            <Link
              to="/search"
              onClick={toggleMobileMenu}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <FiSearch />
              <span>Search</span>
            </Link>

            {user && (
              <>
                <Link
                  to="/create"
                  onClick={toggleMobileMenu}
                  className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg"
                >
                  <FiPlus />
                  <span>Create</span>
                </Link>

                {isAdmin() && (
                  <Link
                    to="/analytics"
                    onClick={toggleMobileMenu}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <FiBarChart2 />
                    <span>Analytics</span>
                  </Link>
                )}

                <div className="px-3 py-2 bg-gray-100 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {user.avatar ? (
                      <img
                        src={`http://localhost:5000${user.avatar}`}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium">{user.name}</span>
                  </div>
                </div>

                <Link
                  to="/settings"
                  onClick={toggleMobileMenu}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <FiSettings />
                  <span>Settings</span>
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="flex items-center space-x-2 px-3 py-2 w-full text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            )}

            {!user && (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={toggleMobileMenu}
                  className="block px-3 py-2 text-center text-primary-600 border border-primary-600 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={toggleMobileMenu}
                  className="block px-3 py-2 text-center bg-primary-600 text-white rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
