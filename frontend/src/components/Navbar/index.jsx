// components/Navbar/index.jsx
import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useCart } from '../../contexts/CartContext';
import { DesktopMenu } from './DesktopMenu';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from '../ThemeToggle';
import { CategoriesMenu } from './CategoriesMenu';
import { SearchBar } from './SearchBar';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const Icons = {
  Logo: () => (
    <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
      <span className="text-white font-bold text-lg">M</span>
    </div>
  ),
  Menu: ({ isOpen }) => (
    <svg
      className="w-6 h-6 text-gray-600 dark:text-gray-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={
          isOpen
            ? 'M6 18L18 6M6 6l12 12'
            : 'M4 6h16M4 12h16M4 18h16'
        }
      />
    </svg>
  ),
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();
  const { getItemCount } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800/50 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Icons.Logo />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              MyShop
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-600 dark:text-gray-300 hover:text-brand-blue transition ${
                location.pathname === '/' ? 'text-brand-blue font-medium' : ''
              }`}
            >
              Home
            </Link>

            <CategoriesMenu />

            {NAV_LINKS.filter((link) => link.path !== '/').map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-gray-600 dark:text-gray-300 hover:text-brand-blue transition ${
                  location.pathname === link.path
                    ? 'text-brand-blue font-medium'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center space-x-4">
            <SearchBar />

            <Link
              to="/cart"
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-brand-blue"
            >
              <FaShoppingCart size={20} />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </Link>

            <ThemeToggle />

            <DesktopMenu
              user={user}
              isOpen={isOpen}
              toggleMenu={() => setIsOpen(!isOpen)}
              onLogout={handleLogout}
              dropdownRef={dropdownRef}
            />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Icons.Menu isOpen={isOpen} />
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <MobileMenu
            user={user}
            navLinks={NAV_LINKS}
            location={location}
            onClose={() => setIsOpen(false)}
            onLogout={handleLogout}
          />
        )}
      </div>
    </nav>
  );
}

export default Navbar;